import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, from } from "@apollo/client";

/*
 * Contexto de autenticación para gestionar el estado del usuario y sus acciones
 * Provee funciones para iniciar y cerrar sesión, además de verificar la autenticación.
 */
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
 * Configuración de Apollo Client con un enlace HTTP y un enlace de autenticación
 * para incluir el token en las solicitudes GraphQL.
 */
const httpLink = new HttpLink({
  uri: "/api/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

// Cliente Apollo con configuración de caché y enlaces
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

/*
 * Proveedor de autenticación que envuelve la aplicación y gestiona
 * el estado del usuario, autenticación y sesión.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  /*
   * Función para iniciar sesión:
   * - Guarda el token en localStorage
   * - Configura axios con el token
   * - Guarda la información del usuario en el estado
   * - Reinicia la caché de Apollo Client
   */
  const login = async (token: string, user: any) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    await client.resetStore();
  };

  /*
   * Función para cerrar sesión:
   * - Elimina el token de localStorage
   * - Limpia los headers de axios
   * - Resetea el estado del usuario
   * - Borra la caché de Apollo Client
   * - Redirige al usuario a la página de login
   */
  const logout = async () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    await client.clearStore();
    router.replace("/login");
  };

  /*
   * Efecto para verificar la autenticación al cargar la aplicación:
   * - Si hay un token en localStorage, intenta recuperar la información del usuario
   * - Si la autenticación falla, limpia el estado del usuario
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post("/api/graphql", {
          query: `
            query {
              currentUser {
                id
                name
                email
              }
            }
          `,
        })
        .then((response) => {
          if (response.data.errors) {
            console.error("Error al obtener usuario:", response.data.errors[0].message);
            setUser(null);
          } else {
            setUser(response.data.data.currentUser);
          }
        })
        .catch((err) => {
          console.error("Error al autenticar usuario:", err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
        {loading ? <div className="flex justify-center items-center h-screen">Cargando...</div> : children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

/*
 * Hook personalizado para acceder al contexto de autenticación en otros componentes.
 */
export const useAuth = () => useContext(AuthContext);

/*
 * Componente de ruta protegida:
 * - Si el usuario no está autenticado, lo redirige al login
 * - Si la autenticación aún está en proceso, muestra un loader
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      setLoading(false);
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return <>{children}</>;
};

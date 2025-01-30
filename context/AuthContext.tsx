import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, from } from "@apollo/client";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuración de Apollo Client
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

// Cliente de Apollo con caché
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const login = async (token: string, user: any) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    await client.resetStore(); // Limpiar caché al iniciar sesión
  };

  const logout = async () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    await client.clearStore(); // Limpiar caché al cerrar sesión
    router.replace("/login"); // 🔥 Redirigir al login al cerrar sesión
  };

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

// Hook para acceder fácilmente al contexto de autenticación en otros componentes
export const useAuth = () => useContext(AuthContext);

// 🔥 **Nuevo Componente para Proteger Rutas**
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

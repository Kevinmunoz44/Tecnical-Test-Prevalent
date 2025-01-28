import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuración del Apollo Client
const httpLink = new HttpLink({
  uri: '/api/graphql', // URL del endpoint GraphQL
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  // Agregar el token al encabezado de autorización si existe
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation); // Continuar con el siguiente middleware o el HttpLink
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]), // Combina authLink con httpLink
  cache: new InMemoryCache(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const login = async (token: string, user: any) => {
    // Guarda el token en localStorage
    localStorage.setItem("token", token);
    
    // Establece el token en los encabezados de Axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Actualiza el estado global con los datos del usuario
    setUser(user);
  };

  const logout = () => {
    // Elimina el token y limpia el estado
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Verifica si el token es válido (por ejemplo, obteniendo el usuario actual)
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.errors) {
            console.error("Error al obtener usuario:", response.data.errors[0].message);
            setLoading(false);
            return;
          }
          setUser(response.data.data.currentUser);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al autenticar usuario:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
        {loading ? <div>Cargando...</div> : children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

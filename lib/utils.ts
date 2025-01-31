import { ApolloClient, InMemoryCache } from "@apollo/client";

/*
 * Configuración de Apollo Client para interactuar con el servidor GraphQL.
 * - `uri`: Especifica la URL del endpoint GraphQL del backend.
 * - `cache`: Usa `InMemoryCache` para gestionar los datos en memoria y optimizar el rendimiento.
 */
const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});

export default client;

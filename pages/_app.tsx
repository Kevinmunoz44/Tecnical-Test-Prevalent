import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/utils";
import { AuthProvider } from "./AuthContext";

export default function App({ Component, pageProps }: any) {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ApolloProvider>
    );
}

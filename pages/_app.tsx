import "../styles/globals.css";
import { AuthProvider, ProtectedRoute } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const publicRoutes = ["/login", "/register"];
  const isAuthRequired = !publicRoutes.includes(router.pathname); // 🔥 No proteger login y register

  return (
    <AuthProvider>
      {isAuthRequired ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

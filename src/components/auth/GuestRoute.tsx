import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../ui/LoadingScreen";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function GuestRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/app" replace />;

  return <>{children}</>;
}

import { Navigate } from "react-router-dom";
import { getToken } from "../services/authStorage";
import Navbar from "./Navbar";

//criado para so permitir acesso a usuarios logados
export default function PrivateRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
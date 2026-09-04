import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../services/authStorage";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="font-semibold text-gray-800">
          Sistema de Produtos
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/home"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Início
          </Link>
          <Link
            to="/products"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Produtos
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1.5 px-3 rounded-md"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/UserService";
import { saveAuth } from "../../services/authStorage";
import PasswordInput from "../../components/PasswordInput";
import Input from "../../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const { token, user } = await loginUser({ email, password });
      saveAuth(token, user);

      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao cadastrar usuário. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          id="senha"
          value={password}
          onChange={setPassword}
          show={showSenha}
          toggleShow={() => setShowSenha((v) => !v)}
        />
        <button
          className="w-full bg-gray-300  py-2 px-4 rounded-md hover:bg-gray-400"
          type="submit"
        >
          Entrar
        </button>
      </form>
      <Link
        to="/cadastro"
        className="text-gray-700 hover:text-gray-800 mt-4 block text-center"
      >
        Não tem uma conta? Faça o cadastro.
      </Link>
    </div>
  );
}

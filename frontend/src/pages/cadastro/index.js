import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/UserService";
import { validateSenha, validateConfirmarSenha } from "../../utils/validators";
import PasswordInput from "../../components/PasswordInput";
import Input from "../../components/Input";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  // erros de validacoes
  const [errors, setErrors] = useState({ email: "", senha: "", confirmarSenha: "" });
  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const runValidations = () => {
    const senhaError = validateSenha(password);
    const confirmError = validateConfirmarSenha(confirmPassword, password);

    setErrors({ senha: senhaError, confirmarSenha: confirmError });
    return !senhaError && !confirmError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!runValidations()) {
      toast.error("Corrija os campos destacados antes de continuar.");
      return;
    }

    const newUser = { name, email, password };

    try {
      await registerUser(newUser);
      toast.success("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao cadastrar usuário. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Cadastro</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nome */}
        <Input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />       

        {/* Email */}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError("email")}}
          required
        />

        {/* Senha */}
        <div className="flex gap-4">
          <PasswordInput
            label="Senha"
            value={password}
            onChange={(v) => { setPassword(v); clearError("senha") }}
            onBlur={() => setErrors((prev) => ({ ...prev, senha: validateSenha(password) }))}
            show={showSenha}
            toggleShow={() => setShowSenha((v) => !v)}
            error={errors.senha}
            id="senha"
          />

          <PasswordInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={(v) => { setConfirmPassword(v); clearError("confirmarSenha") }}
            onBlur={() => setErrors((prev) => ({ ...prev, confirmarSenha: validateConfirmarSenha(confirmPassword, password)}))}
            show={showConfirm}
            toggleShow={() => setShowConfirm((v) => !v)}
            error={errors.confirmarSenha}
            id="confirmarSenha"
          />
        </div>

        <button
          className="w-full bg-gray-300  py-2 px-4 rounded-md hover:bg-gray-400"
          type="submit"
        >
          Cadastrar
        </button>
      </form>
      <Link to="/" className="text-gray-700 hover:text-gray-800 mt-4 block text-center">
        Já tem uma conta? Faça o login.
      </Link>
    </div>
  );
}

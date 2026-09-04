import { Eye, EyeOff } from "lucide-react";

/* campo de senha com botão de mostrar/ocultar */
export default function PasswordInput({ label, value, onChange, onBlur, show, toggleShow, error, id }) {
  return (
    <div className="relative flex-1 flex flex-col">
      <label
        htmlFor={id}
        className={`mb-1 text-sm font-medium ${error ? "text-red-600" : "text-gray-700"}`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Digite sua senha"
          className={`w-full h-10 px-3 pr-10 rounded-md focus:outline-none border ${
            error ? "border-red-600" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
    </div>
  );
}

// campo de input para texto, numero com mensagem de erro
// <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
import { useId } from "react";

export default function Input({ label, error, prefix, id, ...inputProps }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          {...inputProps}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            prefix ? "pl-8" : ""
          } ${error ? "border-red-600" : "border-gray-300"}`}
        />
      </div>
      {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
    </div>
  );
};
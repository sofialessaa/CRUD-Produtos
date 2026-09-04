/* validacao senha */
export function validateSenha(value) {
  if (!value) return "O campo senha é obrigatório";
  if (value.length < 6) return "A senha deve ter no mínimo 6 caracteres";
  return "";
}

/* validacao do confirmar senha */
export function validateConfirmarSenha(confirmValue, senhaValue) {
  if (!confirmValue) return "Confirme sua senha";
  if (confirmValue !== senhaValue) return "As senhas não coincidem";
  return "";
}

// valida se um campo é obrigatório
export function validateRequired(value, fieldLabel) {
  if (!value || !String(value).trim()) return `O campo ${fieldLabel} é obrigatório`;
  return "";
}
 
//valida se o preco é maior que zero
export function validatePrice(value) {
  if (value === "" || value === null || value === undefined) return "O preço é obrigatório";
  const num = Number(value);
  if (Number.isNaN(num)) return "O preço deve ser um número";
  if (num <= 0) return "O preço deve ser maior que zero";
  return "";
}
 
//valida se o estoque é um número inteiro maior ou igual a zero
export function validateStock(value) {
  if (value === "" || value === null || value === undefined) return "O estoque é obrigatório";
  const num = Number(value);
  if (!Number.isInteger(num)) return "O estoque deve ser um número inteiro";
  if (num < 0) return "O estoque não pode ser negativo";
  return "";
}
 
//valida se o produto é válido
export function validateProduct({ name, price, category, stock }) {
  const errors = { name: "", price: "", category: "", stock: "" };
 
  if (!name || !name.trim()) errors.name = "O nome é obrigatório";
 
  if (price === "" || price === null || price === undefined) {
    errors.price = "O preço é obrigatório";
  } else if (Number(price) <= 0) {
    errors.price = "O preço deve ser maior que zero";
  }
 
  if (!category || !category.trim()) errors.category = "A categoria é obrigatória";
 
  if (stock === "" || stock === null || stock === undefined) {
    errors.stock = "O estoque é obrigatório";
  } else if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
    errors.stock = "O estoque deve ser um número inteiro maior ou igual a zero";
  }
 
  return errors;
}
 
// retorna true se todos os campos do objeto de erros estiverem vazios
export function isValid(errors) {
  return Object.values(errors).every((msg) => !msg);
}
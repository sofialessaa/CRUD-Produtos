import api from "./api";

//cadastro de usuário
export async function registerUser(userData) {
  const response = await api.post("/users/register", userData);
  return response.data;
}

//login do usuário
export async function loginUser(credentials) {
  const response = await api.post("/users/login", credentials);
  return response.data;
}
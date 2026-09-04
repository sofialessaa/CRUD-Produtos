import api from "./api";

// busca os produtos do usuario logado
export async function getAllProducts() {
  const response = await api.get("/products");
  return response.data;
}

//busca um produto específico do usuário logado
export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

// cria um novo produto
export async function createProduct(productData) {
  const response = await api.post("/products", productData);
  return response.data;
}

//edita um produto 
export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
}

//deleta um produto 
export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
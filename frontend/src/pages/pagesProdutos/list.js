import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, deleteProduct } from "../../services/ProductService";
import Swal from "sweetalert2";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    const result = await Swal.fire({
      title: "Excluir produto?",
      text: `Tem certeza que deseja excluir "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Produto excluído com sucesso!");
      // remove da lista local, sem precisar buscar tudo de novo
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message =
        err.response?.data?.error || "Erro ao excluir produto. Tente novamente.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando produtos...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Produtos</h2>
        <Link
          to="/products/register"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Novo Produto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Descrição</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Categoria</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Preço</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Estoque</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.description || "-"}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    {Number(product.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded-md disabled:opacity-50"
                      >
                        {deletingId === product.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

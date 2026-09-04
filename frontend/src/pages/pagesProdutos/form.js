import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct, updateProduct, getProduct } from "../../services/ProductService";
import { validateRequired, validatePrice, validateStock } from "../../utils/validators";
import Input from "../../components/Input";

const produto_vazio = { name: "", description: "", price: "", category: "", stock: "" };

export default function ProductForm() {
  const { id } = useParams(); // presente só na rota de edição
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState(produto_vazio);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);

  // se for edicao, busca os dados do produto
  useEffect(() => {
    if (!isEditing) return;

    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct({
          name: data.name ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          category: data.category ?? "",
          stock: data.stock ?? "",
        });
      } catch (err) {
        toast.error("Não foi possível carregar o produto.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditing, navigate]);

  const handleChange = (field) => (event) => {
    setProduct((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const runValidations = () => {
    const newErrors = {
      name: validateRequired(product.name, "Nome"),
      category: validateRequired(product.category, "Categoria"),
      price: validatePrice(product.price),
      stock: validateStock(product.stock),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => !msg);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!runValidations()) {
      toast.error("Corrija os campos destacados antes de continuar.");
      return;
    }

    const payload = { ...product, price: Number(product.price), stock: Number(product.stock)};

    try {
      if (isEditing) {
        await updateProduct(id, payload);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduct(payload);
        toast.success("Produto cadastrado com sucesso!");
      }
      navigate("/products");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erro ao salvar produto. Tente novamente.";
      toast.error(message);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando produto...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {isEditing ? "Editar Produto" : "Cadastrar Produto"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Nome"
          value={product.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            value={product.description}
            onChange={handleChange("description")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <Input
          label="Preço"
          type="number"
          prefix="R$"
          step="0.01"
          value={product.price}
          onChange={handleChange("price")}
          error={errors.price}
        />

        <Input
          label="Categoria"
          value={product.category}
          onChange={handleChange("category")}
          error={errors.category}
        />

        <Input
          label="Estoque"
          type="number"
          value={product.stock}
          onChange={handleChange("stock")}
          error={errors.stock}
        />

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            {isEditing ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

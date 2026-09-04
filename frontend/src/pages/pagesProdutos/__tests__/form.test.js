import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import ProductForm from "../form";
import { createProduct, updateProduct, getProduct } from "../../../services/ProductService";

// troca todas as funções do service por jest.fn() 
// jest.fn() basicamente uma função falsa
jest.mock("../../../services/ProductService");
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

//simula a tela list.js
function ListaProdutosSimulacao() {
  return <h1>Lista de Produtos</h1>;
}

function renderForm(rota) {
  return render(
    <MemoryRouter
      initialEntries={[rota]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }} // flags da v7 ligadas para adotar o comportamento novo e limpar os warnings de deprecação
    >
      <Routes>
        <Route path="/products" element={<ListaProdutosSimulacao />} />
        <Route path="/products/register" element={<ProductForm />} />
        <Route path="/products/edit/:id" element={<ProductForm />} />
      </Routes>
    </MemoryRouter>
  );
}

// preenche o formulário com dados válidos e a descrição é opcional
function preencherFormulario({
  name = "Fone de Ouvido",
  price = "1099.99",
  category = "Periféricos",
  stock = "5",
} = {}) {
  fireEvent.change(screen.getByLabelText("Nome"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Preço"), { target: { value: price } });
  fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: category }});
  fireEvent.change(screen.getByLabelText("Estoque"), {target: { value: stock } });
}

describe("ProductForm", () => {
  it("exibe as mensagens de validação e não chama a API quando os campos estão vazios", async () => {
    renderForm("/products/register");

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    // mensagem que o usuario ve quando da erro
    expect(await screen.findByText("O campo Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo Categoria é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O preço é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O estoque é obrigatório")).toBeInTheDocument();

    expect(toast.error).toHaveBeenCalledWith("Corrija os campos destacados antes de continuar.",);

    expect(createProduct).not.toHaveBeenCalled();
    expect(screen.getByText("Cadastrar Produto")).toBeInTheDocument();
  });

  it("não aceita preço zerado e estoque negativo", async () => {
    renderForm("/products/register");

    preencherFormulario({ price: "0", stock: "-1" });
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(await screen.findByText("O preço deve ser maior que zero"),).toBeInTheDocument();
    expect(screen.getByText("O estoque não pode ser negativo"),).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("limpa a mensagem de erro assim que o usuário corrige o campo", async () => {
    renderForm("/products/register");

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    expect(await screen.findByText("O campo Nome é obrigatório")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nome"), {target: { value: "Fone de Ouvido" }});

    await waitFor(() => {
      expect(screen.queryByText("O campo Nome é obrigatório")).not.toBeInTheDocument();
    });
  });

  it("envia o produto com preço e estoque convertidos para número e volta para a lista", async () => {
    createProduct.mockResolvedValue({ id: 1 });

    renderForm("/products/register");
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        name: "Fone de Ouvido",
        description: "",
        price: 1099.99,
        category: "Periféricos",
        stock: 5,
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Produto cadastrado com sucesso!");
    // verifica a navegação pelo que aparece na tela
    expect(await screen.findByText("Lista de Produtos")).toBeInTheDocument();
  });

  it("mostra a mensagem de erro vinda do backend e mantém o usuário no formulário", async () => {
    createProduct.mockRejectedValue({response: { data: { error: "Já existe um produto com esse nome." } }});

    renderForm("/products/register");
    preencherFormulario();
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Já existe um produto com esse nome.");
    });
    expect(screen.getByText("Cadastrar Produto")).toBeInTheDocument();
    expect(screen.queryByText("Lista de Produtos")).not.toBeInTheDocument();
  });

  it("carrega o produto pelo id da rota e salva as alterações no modo edição", async () => {
    getProduct.mockResolvedValue({
      id: 7,
      name: "Teclado Mecânico",
      description: "Switch azul",
      price: 320,
      category: "Periféricos",
      stock: 7,
    });
    updateProduct.mockResolvedValue({});

    renderForm("/products/edit/7");

    expect(getProduct).toHaveBeenCalledWith("7");

    // durante o carregamento, o usuário vê o aviso
    expect(screen.getByText("Carregando produto...")).toBeInTheDocument();

    // campos vêm preenchidos com os dados do backend
    expect(await screen.findByDisplayValue("Teclado Mecânico")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Switch azul")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Estoque"), {target: { value: "20" }});
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith("7",expect.objectContaining({ name: "Teclado Mecânico", stock: 20 }));
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Produto atualizado com sucesso!",
    );
    expect(await screen.findByText("Lista de Produtos")).toBeInTheDocument();
  });
});

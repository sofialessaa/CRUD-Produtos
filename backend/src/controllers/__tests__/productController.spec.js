import { jest } from "@jest/globals";

// mock do Prisma
jest.mock("@prisma/client", () => {
  const productMock = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => ({ product: productMock })) };
});

import { PrismaClient } from "@prisma/client";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../productController.js";

const prisma = new PrismaClient();

// simula o objeto response do Express.
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const USER_ID = 1;

describe("productController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); //faço isso pra n dar erro no toHaveBeenCalledTimes(1)
    jest.spyOn(console, "error").mockImplementation(() => {}); // feito para não poluir a saída dos testes
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("createProduct", () => {
    it("deve criar um produto e retornar status 201", async () => {
      const body = {
        name: "Fone de Ouvido",
        description: "Bluetooth, lightspeed e usb",
        price: 1099.99,
        category: "Periféricos",
        stock: 5,
      };
      const produtoCriado = { id: 1, ...body, userId: USER_ID };

      prisma.product.create.mockResolvedValue(produtoCriado);

      const req = { body, user: { id: USER_ID } };
      const res = mockResponse();

      await createProduct(req, res);

      // garante que o userId do token foi colocado no registro
      expect(prisma.product.create).toHaveBeenCalledTimes(1);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: { ...body, userId: USER_ID },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(produtoCriado);
    });

    it("deve retornar 409 quando o nome do produto já existir", async () => {
      const erro = new Error("Unique constraint failed on the fields: (`name`)");
      erro.code = "P2002"; // P2002 é o código do prisma para violação de constraint unique
      prisma.product.create.mockRejectedValue(erro);

      const req = {
        body: {
          name: "Fone de Ouvido",
          price: 1099.99,
          category: "Periféricos",
          stock: 5,
        },
        user: { id: USER_ID },
      };
      const res = mockResponse();

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "Já existe um produto cadastrado com este nome.",
      });
    });

    it("deve retornar status 500 quando o Prisma lançar um erro", async () => {
      prisma.product.create.mockRejectedValue(new Error("Falha no banco"));

      const req = {
        body: { name: "Mouse", price: 99.9, category: "Periféricos", stock: 5 },
        user: { id: USER_ID },
      };
      const res = mockResponse();

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro interno ao criar produto.",
      });
    });
  });

  describe("getAllProducts", () => {
    it("deve retornar apenas os produtos do usuário autenticado com status 200", async () => {
      const produtos = [
        {
          id: 1,
          name: "Teclado",
          price: 350,
          category: "Periféricos",
          stock: 10,
          userId: USER_ID,
        },
        {
          id: 2,
          name: "Monitor",
          price: 900,
          category: "Monitores",
          stock: 3,
          userId: USER_ID,
        },
      ];
      prisma.product.findMany.mockResolvedValue(produtos);

      const req = { user: { id: USER_ID } };
      const res = mockResponse();

      await getAllProducts(req, res);

      // filtra pois um usuário não pode ver produtos de outro
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(produtos);
    });

    it("deve retornar status 500 quando a busca falhar", async () => {
      prisma.product.findMany.mockRejectedValue(new Error("Conexão perdida"));

      const res = mockResponse();
      await getAllProducts({ user: { id: USER_ID } }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar produtos.",
      });
    });
  });

  describe("getProductById", () => {
    it("deve converter o id da rota para número e retornar o produto", async () => {
      const produto = {
        id: 7,
        name: "Microfone",
        price: 263.50,
        category: "Microfone",
        stock: 2,
        userId: USER_ID,
      };
      prisma.product.findUnique.mockResolvedValue(produto);

      // req.params.id sempre chega como string na rota do Express
      const req = { params: { id: "7" }, user: { id: USER_ID } };
      const res = mockResponse();

      await getProductById(req, res);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 7, userId: USER_ID },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(produto);
    });
  });

  describe("updateProduct", () => {
    it("deve atualizar o produto e retornar status 200", async () => {
      const body = {
        name: "Teclado Mecânico",
        description: "Produto da LogiTech - att",
        price: 399.9,
        category: "Periféricos",
        stock: 8,
      };
      const atualizado = { id: 3, ...body, userId: USER_ID };
      prisma.product.update.mockResolvedValue(atualizado);

      const req = { params: { id: "3" }, body, user: { id: USER_ID } };
      const res = mockResponse();

      await updateProduct(req, res);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 3, userId: USER_ID },
        data: body,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(atualizado);
    });

    it("deve retornar status 500 quando a atualização falhar", async () => {
      prisma.product.update.mockRejectedValue(
        new Error("Registro não encontrado"),
      );

      const req = {
        params: { id: "999" },
        body: { name: "X" },
        user: { id: USER_ID },
      };
      const res = mockResponse();

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao atualizar produto.",
      });
    });
  });

  describe("deleteProduct", () => {
    it("deve deletar o produto e retornar status 200", async () => {
      const deletado = {
        id: 5,
        name: "Webcam",
        price: 247.0,
        category: "Vídeo",
        stock: 1,
        userId: USER_ID,
      };
      prisma.product.delete.mockResolvedValue(deletado);

      const req = { params: { id: "5" }, user: { id: USER_ID } };
      const res = mockResponse();

      await deleteProduct(req, res);

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 5, userId: USER_ID },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletado);
    });

    it("deve retornar status 500 quando a exclusão falhar", async () => {
      prisma.product.delete.mockRejectedValue(new Error("FK constraint"));

      const res = mockResponse();
      await deleteProduct({ params: { id: "5" }, user: { id: USER_ID } }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao deletar produto.",
      });
    });
  });
});

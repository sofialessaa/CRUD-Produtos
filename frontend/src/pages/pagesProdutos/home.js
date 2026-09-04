import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    {
      title: "Cadastro de Novo Produto",
      route: "/products/register",
    },
    {
      title: "Lista de Produtos",
      route: "/products",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center mt-20 px-4">
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col"
          >
            <h5 className="text-lg font-semibold mb-2">{item.title}</h5>
            <Link
              to={item.route}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md self-center"
            >
              Acessar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

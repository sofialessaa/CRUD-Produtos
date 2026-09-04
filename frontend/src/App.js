import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Home from "./pages/pagesProdutos/home";
import PrivateRoute from "./components/privateRoutes";
import ProductForm from "./pages/pagesProdutos/form";
import ProductList from "./pages/pagesProdutos/list";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
        <Route path="/products/register" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

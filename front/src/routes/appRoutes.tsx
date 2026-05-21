import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../home/home";
import ProductScreen from "../products/productScreen/productScreen";
import ProductDetailScreen from "../products/productDetailScreen/productDetailScreen";
import LoginScreen from "../login/loginScreen";
import ManagementScreen from "../management/managementScreen";
import SobreScreen from "../sobre/sobreScreen";
import ContactScreen from "../contato/contactScreen";
import RequireAuth from "./RequireAuth";
import TabelaPrecos from "../tabelaPrecos/tabelaPrecos";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<ProductScreen />} />
        <Route path="/produtos/:id" element={<ProductDetailScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/management"
          element={
            <RequireAuth>
              <ManagementScreen />
            </RequireAuth>
          }
        />
        <Route path="/contato" element={<ContactScreen />} />
        <Route path="/sobre" element={<SobreScreen />} />
        <Route path="/tabela-precos" element={<TabelaPrecos />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

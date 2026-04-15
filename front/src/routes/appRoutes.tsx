import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../home/home";
import ProductScreen from "../products/productScreen/productScreen";
import ProductDetailScreen from "../products/productDetailScreen/productDetailScreen";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<ProductScreen />} />
        <Route path="/produtos/:id" element={<ProductDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

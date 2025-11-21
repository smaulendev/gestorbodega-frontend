import { Routes, Route } from "react-router-dom";

import ProductosView from "../views/ProductosView";
import LotesView from "../views/LotesView";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/productos" element={<ProductosView />} />
      <Route path="/lotes" element={<LotesView />} />
      <Route path="*" element={<ProductosView />} />
    </Routes>
  );
}

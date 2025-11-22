// import { Routes, Route } from "react-router-dom";

// import ProductosView from "../views/ProductosView";
// import LotesView from "../views/LotesView";

// export default function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/productos" element={<ProductosView />} />
//       <Route path="/lotes" element={<LotesView />} />
//       <Route path="*" element={<ProductosView />} />
//     </Routes>
//   );
// }

import { Routes, Route } from "react-router-dom";

import ProductosView from "../views/ProductosView";
import LotesView from "../views/LotesView";
import IngresarStockView from "../views/IngresarStockView";
import TransferenciasView from "../views/TransferenciasView";
import MovimientosView from "../views/MovimientosView";
import BodegasView from "../views/BodegasView";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProductosView />} />
      <Route path="/productos" element={<ProductosView />} />
      <Route path="/lotes" element={<LotesView />} />
      <Route path="/bodegas" element={<BodegasView />} />
      <Route path="/ingresar-stock" element={<IngresarStockView />} />
      <Route path="/transferencias" element={<TransferenciasView />} />
      <Route path="/movimientos" element={<MovimientosView />} />
    </Routes>
  );
}

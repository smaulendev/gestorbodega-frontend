import { Routes, Route } from "react-router-dom";

import ProductosView from "../views/ProductosView";
import LotesView from "../views/LotesView";
import IngresarStockView from "../views/IngresarStockView";
import TransferenciasView from "../views/TransferenciasView";
import BodegasView from "../views/BodegasView";
import InventarioView from "../views/InventarioView";
import MovimientosView from "../views/MovimientosView";
import PickingFefoView from "../views/PickingFefoView";

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
      <Route path="/inventario" element={<InventarioView />} />  
      <Route path="/movimientos" element={<MovimientosView />} /> 
      <Route path="/picking-fefo" element={<PickingFefoView />} />

      
    </Routes>
  );
}

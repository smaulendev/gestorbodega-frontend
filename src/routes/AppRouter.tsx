import { Routes, Route, Navigate } from "react-router-dom";

import LoginView from "../views/LoginView";
import ProductosView from "../views/ProductosView";
import LotesView from "../views/LotesView";
import IngresarStockView from "../views/IngresarStockView";
import TransferenciasView from "../views/TransferenciasView";
import BodegasView from "../views/BodegasView";
import InventarioView from "../views/InventarioView";
import MovimientosView from "../views/MovimientosView";
import PickingFefoView from "../views/PickingFefoView";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>

      {/* Rutas públicas */}
      <Route path="/login" element={<LoginView />} />

      {/* Rutas protegidas */}
      <Route
        path="/productos"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ProductosView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lotes"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "OPERARIO"]}>
            <LotesView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bodegas"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <BodegasView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ingresar-stock"
        element={
          <ProtectedRoute allowedRoles={["OPERARIO", "ADMIN"]}>
            <IngresarStockView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transferencias"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <TransferenciasView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventario"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "OPERARIO", "VENDEDOR"]}>
            <InventarioView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/movimientos"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MovimientosView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/picking-fefo"
        element={
          <ProtectedRoute allowedRoles={["OPERARIO", "ADMIN"]}>
            <PickingFefoView />
          </ProtectedRoute>
        }
      />

      {/* DEFAULT REDIRECT */}
      <Route path="*" element={<Navigate to="/inventario" />} />

    </Routes>
  );
}

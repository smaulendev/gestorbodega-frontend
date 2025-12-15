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
import UsuariosView from "../views/UsuariosView";
import DashboardView from "../views/DashboardView";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* RUTA PÚBLICA */}
      <Route path="/login" element={<LoginView />} />

      {/* DASHBOARD COMO HOME */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "OPERARIO", "VENDEDOR"]}>
            <DashboardView />
          </ProtectedRoute>
        }
      />

      {/* RUTAS PROTEGIDAS */}
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

      {/* SOLO ADMIN: GESTIÓN DE USUARIOS */}
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UsuariosView />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

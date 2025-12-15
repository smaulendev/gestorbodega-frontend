// src/services/reportesServices.ts
import axios from "axios";

const API = "http://localhost:3000/reportes";

export interface DashboardResumen {
  productosDistintos: number;
  stockDisponible: number;
  lotesPorVencer: number;
  movimientosHoy: number;
}

export interface MovimientoDiario {
  fecha: string;
  total: number;
}

// Helper para centralizar el header
const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ===================== RESUMEN DASHBOARD =====================
export const getDashboardResumen = async (token: string) => {
  try {
    const res = await axios.get<DashboardResumen>(
      `${API}/dashboard`,
      authHeaders(token)
    );
    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al obtener resumen dashboard:", error.response || error);
    return {
      ok: false,
      error: error.response?.data?.message || "Error al obtener resumen dashboard",
      full: error.response?.data || null,
    };
  }
};

// ===================== MOVIMIENTOS DIARIOS =====================
export const getMovimientosDiarios = async (token: string) => {
  try {
    const res = await axios.get<MovimientoDiario[]>(
      `${API}/movimientos-diarios`,
      authHeaders(token)
    );
    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al obtener movimientos diarios:", error.response || error);
    return {
      ok: false,
      error:
        error.response?.data?.message || "Error al obtener movimientos diarios",
      full: error.response?.data || null,
    };
  }
};

export const ReportesService = {
  getDashboardResumen,
  getMovimientosDiarios,
};

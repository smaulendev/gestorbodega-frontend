import axios from "axios";

const API = "http://localhost:3000/inventario";

// -------------------------------------------------------------
// ✔ INGRESAR STOCK
// -------------------------------------------------------------
export const ingresarStock = async (data: any) => {
  try {
    const res = await axios.post(`${API}/ingresar`, data);
    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al ingresar stock:", error.response?.data);

    return {
      ok: false,
      error: error.response?.data?.message || "Error desconocido",
      full: error.response?.data || null,
    };
  }
};

// -------------------------------------------------------------
// ✔ INVENTARIO GENERAL
// -------------------------------------------------------------
export const getInventario = async () => {
  try {
    const res = await axios.get(`${API}/general`);
    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ||
        "Error al obtener inventario general",
    };
  }
};

// -------------------------------------------------------------
// ✔ INVENTARIO FILTRADO (producto, lote, bodega, estado)
// -------------------------------------------------------------
export const getInventarioFiltrado = async (params: any = {}) => {
  try {
    const res = await axios.get(`${API}/filtrar`, { params });
    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ||
        "Error al obtener inventario filtrado",
    };
  }
};

// -------------------------------------------------------------
// ✔ SUGERENCIA FEFO (HU002)
// -------------------------------------------------------------
export const obtenerFefo = async (sku: string) => {
  try {
    const res = await axios.get(`${API}/fefo/${sku}`);
    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data?.message || "Error al obtener FEFO",
    };
  }
};

// -------------------------------------------------------------
// ✔ CONFIRMAR PICKING FEFO (HU002)
// -------------------------------------------------------------
export const confirmarPicking = async (data: any) => {
  try {
    const res = await axios.post(`${API}/picking`, data);
    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ||
        "Error al confirmar picking FEFO",
    };
  }
};

// -------------------------------------------------------------
// ✔ AJUSTAR STOCK (sumar / restar manualmente)
// -------------------------------------------------------------
interface AjustarStockPayload {
  cantidad: number;
  tipo: "POS" | "NEG";
  motivo?: string;
}

export const ajustarStock = async (
  inventarioId: number,
  payload: AjustarStockPayload
) => {
  try {
    const res = await axios.patch(`${API}/${inventarioId}/ajustar`, payload);
    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al ajustar stock:", error.response?.data);

    return {
      ok: false,
      error:
        error.response?.data?.message ||
        "Error al ajustar stock",
      full: error.response?.data || null,
    };
  }
};

// -------------------------------------------------------------
// ✔ EXPORTACIÓN ORDENADA (objeto de servicio)
// -------------------------------------------------------------
export const InventarioService = {
  ingresarStock,
  getInventario,
  getInventarioFiltrado,
  obtenerFefo,
  confirmarPicking,
  ajustarStock,
};

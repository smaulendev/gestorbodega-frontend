import axios from "axios";

const API = "http://localhost:3000/inventario";

// --------------------------------------
// ✔ Ingresar Stock
// --------------------------------------
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

// --------------------------------------
// ✔ Obtener inventario general
// --------------------------------------

export const getInventario = async (params = {}) => {
  try {
    const res = await axios.get(API, { params });
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data?.message || "Error al obtener inventario",
    };
  }
};
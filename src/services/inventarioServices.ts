import axios from "axios";
const API = "http://localhost:3000/inventario";

export const ingresarStock = async (data) => {
  try {
    const res = await axios.post(`${API}/ingresar`, data);
    return { ok: true, data: res.data };
  } catch (error) {
    console.error("❌ Error al ingresar stock:", error.response?.data);

    return {
      ok: false,
      error: error.response?.data?.message || "Error desconocido",
      full: error.response?.data || null,
    };
  }
};

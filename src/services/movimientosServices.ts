import axios from "axios";

const API = "http://localhost:3000/movimientos";

export const getMovimientos = async () => {
  try {
    const res = await axios.get(API);
    return { ok: true, data: res.data };
  } catch (err) {
    console.error("Error cargando movimientos:", err);
    return { ok: false, error: err.response?.data || "Error desconocido" };
  }
};

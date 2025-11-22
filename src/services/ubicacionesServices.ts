import axios from "axios";
const API = "http://localhost:3000/ubicaciones";

// export async function getUbicacionesByBodega(bodegaId: number) {
//   const res = await fetch(`${API}/bodega/${bodegaId}`);
//   return res.json();
// }

export async function createUbicacion(nombre: string, bodegaId: number) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, bodegaId }),
  });
  return res.json();
}

export async function deleteUbicacion(id: number) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
}

export const getUbicacionesByBodega = async (bodegaId: number) => {
  const res = await axios.get(`${API}/bodega/${bodegaId}`);
  return res.data;
};
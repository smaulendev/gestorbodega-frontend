import axios from "axios";

const API = "http://localhost:3000/productos";

export const getProductos = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createProducto = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateProducto = async (id: number, data: any) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
};

export const deleteProductoService = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

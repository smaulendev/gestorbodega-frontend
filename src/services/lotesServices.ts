import axios from "axios";

const API = "http://localhost:3000/lotes";

export const getLotes = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createLote = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const deleteLote = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

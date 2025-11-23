import axios from "axios";

const API = "http://localhost:3000/auth";

export interface LoginResponse {
  access_token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: "ADMIN" | "OPERARIO" | "VENDEDOR";
  };
}

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API}/login`, {
    email,
    password,
  });

  return res.data;
};

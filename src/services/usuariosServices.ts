// src/services/usuariosServices.ts
import axios from "axios";

const API = "http://localhost:3000/usuarios";

// Todas las funciones reciben el token explícitamente
// así no dependemos de localStorage ni cosas mágicas

// ===============================
// GET /usuarios -> listar todos
// ===============================
export const getUsuarios = async (token: string) => {
  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.response?.data);

    return {
      ok: false,
      error:
        error.response?.data?.message ||
        "Error al obtener la lista de usuarios",
    };
  }
};

// ===============================
// PATCH /usuarios/:id -> actualizar
// ===============================
export const updateUsuario = async (
  token: string,
  id: number,
  payload: any
) => {
  try {
    const res = await axios.patch(`${API}/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al actualizar usuario:", error.response?.data);

    return {
      ok: false,
      error:
        error.response?.data?.message || "Error al actualizar el usuario",
    };
  }
};

// ===============================
// DELETE /usuarios/:id -> desactivar
// ===============================
export const desactivarUsuario = async (token: string, id: number) => {
  try {
    const res = await axios.delete(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("❌ Error al desactivar usuario:", error.response?.data);

    return {
      ok: false,
      error:
        error.response?.data?.message || "Error al desactivar el usuario",
    };
  }
};

export const UsuariosService = {
  getUsuarios,
  updateUsuario,
  desactivarUsuario,
};

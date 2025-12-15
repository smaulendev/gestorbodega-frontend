import { useEffect, useState } from "react";
import {
  getUsuarios,
  updateUsuario,
  desactivarUsuario,
} from "../services/usuariosServices";
import { useAuth } from "../context/AuthContext";
import { Users, Shield, Edit2, ToggleLeft, ToggleRight } from "lucide-react";

type Rol = "ADMIN" | "OPERARIO" | "VENDEDOR";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo?: boolean;
  creadoEn?: string;
}

export default function UsuariosView() {
  const { token } = useAuth(); // 👈 de tu AuthContext
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================
  // Cargar usuarios al inicio
  // ==========================
  useEffect(() => {
    if (!token) {
      setError("Unauthorized");
      setUsuarios([]);
      return;
    }
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cargarUsuarios = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    const res = await getUsuarios(token);

    if (!res.ok) {
      setError(res.error || "Error al obtener usuarios");
      setUsuarios([]);
    } else {
      setUsuarios(res.data);
    }

    setLoading(false);
  };

  // ==========================
  // Cambiar rol
  // ==========================
  const handleChangeRol = async (id: number, nuevoRol: Rol) => {
    if (!token) return;

    const res = await updateUsuario(token, id, { rol: nuevoRol });

    if (!res.ok) {
      alert(res.error);
      return;
    }

    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
    );
  };

  // ==========================
  // Activar / desactivar
  // ==========================
  const handleToggleActivo = async (usuario: Usuario) => {
    if (!token) return;

    const nuevoEstado = !usuario.activo;

    // si quieres usar DELETE para desactivar:
    if (!nuevoEstado) {
      const res = await desactivarUsuario(token, usuario.id);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, activo: false } : u
        )
      );
    } else {
      // reactivar con PATCH
      const res = await updateUsuario(token, usuario.id, {
        activo: true,
      });
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, activo: true } : u
        )
      );
    }
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="p-6 text-white min-h-screen">
      <header className="mb-6 flex items-center gap-3">
        <Users size={28} className="text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-400 text-sm">
            Administra los perfiles de administradores, operarios y vendedores.
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-400">Cargando usuarios...</p>}

      {!loading && usuarios.length === 0 && !error && (
        <p className="text-gray-400">No hay usuarios registrados.</p>
      )}

      {!loading && usuarios.length > 0 && (
        <div className="space-y-3">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="bg-[#0b1220]/80 border border-[#1e293b] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Shield size={18} className="text-blue-400" />
                  {u.nombre}
                  {!u.activo && (
                    <span className="ml-2 text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                      Inactivo
                    </span>
                  )}
                </h2>
                <p className="text-gray-400 text-sm">{u.email}</p>
                {u.creadoEn && (
                  <p className="text-gray-500 text-xs mt-1">
                    Creado: {new Date(u.creadoEn).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                {/* Rol */}
                <div className="flex items-center gap-2">
                  <Edit2 size={16} className="text-gray-400" />
                  <select
                    value={u.rol}
                    onChange={(e) => handleChangeRol(u.id, e.target.value as Rol)}
                    className="bg-[#020617] border border-[#1e293b] rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="OPERARIO">OPERARIO</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                  </select>
                </div>

                {/* Activo / Inactivo */}
                <button
                  onClick={() => handleToggleActivo(u)}
                  className="flex items-center gap-2 text-sm bg-[#020617] border border-[#1e293b] rounded-lg px-3 py-1 hover:border-blue-500 transition"
                >
                  {u.activo ? (
                    <>
                      <ToggleRight className="text-green-400" size={18} />
                      Activo
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="text-red-400" size={18} />
                      Inactivo
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@bodega.cl");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (!result.ok) {
      setError(result.error || "Error al iniciar sesión");
      return;
    }

    navigate("/inventario");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6">

      {/* CARD */}
      <div className="w-full max-w-sm bg-[#1e293b]/60 backdrop-blur-xl border border-[#334155] rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]">

        {/* Título */}
        <h2 className="text-center text-3xl font-bold text-white mb-6 tracking-tight">
          Bienvenido a <span className="text-blue-400">Bodega FEFO</span>
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-600/80 border border-red-400 p-3 rounded text-sm mb-4 text-white">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="correo@empresa.cl"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold tracking-wide shadow-lg shadow-blue-500/20 transition-all"
          >
            <LogIn size={20} />
            Entrar
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Sistema FEFO — Gestión Inteligente de Inventario
        </p>
      </div>
    </div>
  );
};

export default LoginView;

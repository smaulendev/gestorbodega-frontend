// src/views/DashboardView.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardResumen,
  getMovimientosDiarios,
  type MovimientoDiario,
  type DashboardResumen,
} from "../services/reportesServices";
import { Activity, Box, AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardView() {
  const { token, user } = useAuth();

  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoDiario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return; // aún no restaura sesión

    const cargar = async () => {
      setLoading(true);
      setError(null);

      const [resResumen, resMov] = await Promise.all([
        getDashboardResumen(token),
        getMovimientosDiarios(token),
      ]);

      if (!resResumen.ok) {
        setError(resResumen.error || "Error al obtener resumen dashboard");
      } else {
        setResumen(resResumen.data);
      }

      if (resMov.ok) {
        setMovimientos(resMov.data);
      }

      setLoading(false);
    };

    cargar();
  }, [token]);

  return (
    <div className="p-6 text-white min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-blue-400" />
          Vista General
        </h1>
        <p className="text-slate-400 mt-1">
          Hola {user?.nombre || "Administrador"}, aquí tienes un resumen rápido del estado de la bodega.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-600/90 border border-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <CardKpi
          titulo="PRODUCTOS DISTINTOS"
          valor={resumen?.productosDistintos ?? 0}
          icon={<Box className="text-sky-400" />}
          subtitulo="SKU únicos registrados en inventario."
        />
        <CardKpi
          titulo="STOCK DISPONIBLE"
          valor={resumen?.stockDisponible ?? 0}
          icon={<Activity className="text-emerald-400" />}
          subtitulo="Unidades utilizables hoy."
        />
        <CardKpi
          titulo="LOTES POR VENCER (30 DÍAS)"
          valor={resumen?.lotesPorVencer ?? 0}
          icon={<AlertTriangle className="text-amber-400" />}
          subtitulo="Control FEFO para próximos vencimientos."
        />
        <CardKpi
          titulo="MOVIMIENTOS HOY"
          valor={resumen?.movimientosHoy ?? 0}
          icon={<RefreshCw className="text-indigo-400" />}
          subtitulo="Ingresos, salidas y picking registrados."
        />
      </div>

      {/* GRÁFICO + TEXTO FEFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimientos últimos 7 días */}
        <div className="bg-[#020617] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-1">Movimientos últimos 7 días</h2>
          <p className="text-xs text-slate-400 mb-4">
            Incluye ingresos, salidas y picking registrados en el sistema.
          </p>

          {loading ? (
            <p className="text-slate-400 text-sm">Cargando datos...</p>
          ) : movimientos.length === 0 ? (
            <p className="text-slate-500 text-sm mt-8 text-center">
              No hay movimientos registrados en los últimos días.
            </p>
          ) : (
            <div className="mt-2">
              {/* Gráfico ultra simple con barras usando solo divs */}
              <div className="flex items-end gap-3 h-40">
                {movimientos.map((m) => {
                  const max = Math.max(...movimientos.map((x) => x.total || 0)) || 1;
                  const height = (m.total / max) * 100;
                  return (
                    <div key={m.fecha} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-cyan-400"
                        style={{ height: `${height}%` }}
                        title={`${m.fecha}: ${m.total}`}
                      />
                      <span className="mt-1 text-[10px] text-slate-400">
                        {new Date(m.fecha).toLocaleDateString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Panel FEFO */}
        <div className="bg-[#020617] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-1">Estado rápido FEFO</h2>
          <p className="text-xs text-slate-400 mb-4">
            Recomendaciones rápidas para mantener el control sanitario.
          </p>

          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              • <span className="font-semibold">Lotes por vencer:</span>{" "}
              {resumen?.lotesPorVencer ?? 0}
            </li>
            <li>
              • Revisa el módulo{" "}
              <span className="text-sky-400 font-semibold">Picking FEFO</span> para forzar
              siempre el lote con fecha más próxima.
            </li>
            <li>
              • Desde{" "}
              <span className="text-sky-400 font-semibold">Ingresar Stock</span> asegúrate
              de registrar siempre lote y caducidad para consumibles.
            </li>
          </ul>

          <div className="mt-5 text-xs text-slate-500 border-t border-slate-800 pt-3">
            Este dashboard es solo el comienzo 🚀.  
            Puedes extenderlo con:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Top productos con mayor rotación.</li>
              <li>Alertas de stock bajo por bodega.</li>
              <li>Detalle de lotes específicos a punto de vencer.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para las tarjetas KPI
interface CardProps {
  titulo: string;
  valor: number | string;
  icon: React.ReactNode;
  subtitulo?: string;
}

function CardKpi({ titulo, valor, icon, subtitulo }: CardProps) {
  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400">{titulo}</span>
        <div className="p-2 rounded-full bg-sky-900/40 border border-sky-700/40">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-tight">{valor}</div>
      {subtitulo && (
        <p className="mt-2 text-[11px] text-slate-500 leading-snug">{subtitulo}</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientosServices";
import { History, Package, ArrowRightLeft } from "lucide-react";

export default function MovimientosView() {
  const [movs, setMovs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    setLoading(true);
    const res = await getMovimientos();
    if (res.ok) setMovs(res.data);
    setLoading(false);
  };

  const colorMovimiento = (tipo) => {
    switch (tipo) {
      case "INGRESO":
        return "text-green-400";
      case "PICKING":
        return "text-yellow-400";
      case "TRANSFERENCIA":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-24 text-white">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <History size={32} className="text-blue-400" />
        Movimientos de Inventario
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 mb-4 text-center">Cargando movimientos...</p>
      )}

      {/* LISTA */}
      <div className="w-full max-w-4xl space-y-4">
        {movs.map((m) => (
          <div
            key={m.id}
            className="bg-slate-800/70 border border-slate-700 p-5 rounded-xl shadow-md hover:shadow-blue-500/10 transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${colorMovimiento(m.tipoMovimiento)}`}>
                <ArrowRightLeft size={20} />
                {m.tipoMovimiento}
              </h2>

              <span className="text-sm text-slate-300">
                {new Date(m.fecha).toLocaleString("es-CL")}
              </span>
            </div>

            {/* PRODUCTO */}
            <div className="mt-2 flex items-center gap-2">
              <Package size={18} className="text-blue-300" />
              <p className="font-medium">{m.producto.nombre}</p>
            </div>

            {/* DETALLES */}
            <div className="mt-2 text-slate-300 space-y-1">
              <p>
                <strong className="text-white">Cantidad:</strong> {m.cantidad}
              </p>
              <p>
                <strong className="text-white">Lote:</strong> {m.lote.codigoLote}
              </p>
              <p>
                <strong className="text-white">Bodega:</strong> {m.bodega.nombre}
              </p>
              <p>
                <strong className="text-white">Ubicación:</strong> {m.ubicacion.nombre}
              </p>
            </div>

            {/* DESCRIPCIÓN */}
            {m.descripcion && (
              <p className="mt-3 italic text-slate-400">
                {m.descripcion}
              </p>
            )}
          </div>
        ))}

        {movs.length === 0 && !loading && (
          <p className="text-center text-slate-400 mt-6">
            No hay movimientos registrados.
          </p>
        )}
      </div>
    </div>
  );
}

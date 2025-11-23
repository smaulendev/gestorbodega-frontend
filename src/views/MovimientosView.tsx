import { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientosServices";

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

  return (
    <div className="p-5 text-white">
      <h1 className="text-2xl mb-5">Movimientos</h1>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Cargando movimientos...</p>}

      {/* LISTA DE MOVIMIENTOS */}
      <div className="space-y-4">
        {movs.map((m) => (
          <div key={m.id} className="bg-gray-800 p-4 rounded shadow-md">

            {/* TÍTULO */}
            <div className="flex justify-between">
              <p className="text-lg font-bold">
                {m.tipoMovimiento} — {m.producto.nombre}
              </p>

              <span className="text-sm text-gray-300">
                {new Date(m.fecha).toLocaleString()}
              </span>
            </div>

            {/* DETALLES */}
            <p><strong>Cantidad:</strong> {m.cantidad}</p>
            <p><strong>Lote:</strong> {m.lote.codigoLote}</p>
            <p><strong>Bodega:</strong> {m.bodega.nombre}</p>
            <p><strong>Ubicación:</strong> {m.ubicacion.nombre}</p>

            {m.descripcion && (
              <p className="mt-2 italic text-gray-300">
                {m.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  getBodegas,
  createBodega,
  deleteBodega,
} from "../services/bodegasServices";

import {
  getUbicacionesByBodega,
  createUbicacion,
  deleteUbicacion,
} from "../services/ubicacionesServices";

export default function BodegasView() {
  const [bodegas, setBodegas] = useState([]);
  const [nombreBodega, setNombreBodega] = useState("");

  const [ubicaciones, setUbicaciones] = useState({});
  const [nuevaUbicacion, setNuevaUbicacion] = useState({});

  const cargarBodegas = async () => {
    const data = await getBodegas();
    setBodegas(data);

    // Cargar ubicaciones de cada bodega
    const ubicacionesMap = {};
    for (const b of data) {
      ubicacionesMap[b.id] = await getUbicacionesByBodega(b.id);
    }
    setUbicaciones(ubicacionesMap);
  };

  useEffect(() => {
    cargarBodegas();
  }, []);

  // Crear bodega
  const handleSubmitBodega = async (e) => {
    e.preventDefault();
    if (!nombreBodega.trim()) return;
    await createBodega({ nombre: nombreBodega });
    setNombreBodega("");
    cargarBodegas();
  };

  // Crear ubicación
  const handleCrearUbicacion = async (bodegaId) => {
    const nombre = nuevaUbicacion[bodegaId];
    if (!nombre?.trim()) return;

    await createUbicacion(nombre, bodegaId);
    setNuevaUbicacion({ ...nuevaUbicacion, [bodegaId]: "" });
    cargarBodegas();
  };

  // Eliminar ubicación
  const handleEliminarUbicacion = async (id) => {
    if (!confirm("¿Eliminar ubicación?")) return;
    await deleteUbicacion(id);
    cargarBodegas();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Bodegas</h1>

      {/* Crear bodega */}
      <form
        onSubmit={handleSubmitBodega}
        className="bg-gray-800 p-4 rounded-lg max-w-md"
      >
        <input
          type="text"
          placeholder="Nombre de bodega"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          value={nombreBodega}
          onChange={(e) => setNombreBodega(e.target.value)}
        />
        <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 p-2 rounded">
          Crear Bodega
        </button>
      </form>

      {/* Listado de bodegas */}
      <div className="mt-6 space-y-4">
        {bodegas.map((b) => (
          <div key={b.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{b.nombre}</h2>

              <button
                onClick={() => deleteBodega(b.id)}
                className="text-red-400 hover:text-red-600"
              >
                Eliminar
              </button>
            </div>

            {/* Lista de ubicaciones */}
            <div className="mt-4 pl-4 border-l border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Ubicaciones</h3>

              <ul className="space-y-2">
                {ubicaciones[b.id]?.map((u) => (
                  <li
                    key={u.id}
                    className="flex justify-between bg-gray-900 px-3 py-2 rounded"
                  >
                    {u.nombre}
                    <button
                      onClick={() => handleEliminarUbicacion(u.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>

              {/* Crear nueva ubicación */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva ubicación"
                  value={nuevaUbicacion[b.id] || ""}
                  onChange={(e) =>
                    setNuevaUbicacion({
                      ...nuevaUbicacion,
                      [b.id]: e.target.value,
                    })
                  }
                  className="flex-1 bg-gray-900 p-2 rounded border border-gray-700"
                />

                <button
                  onClick={() => handleCrearUbicacion(b.id)}
                  className="bg-green-600 hover:bg-green-700 px-4 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getLotes, createLote, deleteLote } from "../services/lotesServices";
import { getProductos } from "../services/productosServices";
import { CalendarDays, PackagePlus, Trash2 } from "lucide-react";

export default function LotesView() {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    productoId: "",
    fechaCaducidad: "",
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLotes(await getLotes());
    setProductos(await getProductos());
  };

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!form.productoId || !form.fechaCaducidad) {
      setError("Debe completar todos los campos.");
      setLoading(false);
      return;
    }

    const payload = {
      productoId: Number(form.productoId),
      fechaCaducidad: form.fechaCaducidad,
    };

    try {
      await createLote(payload);
      setSuccess("Lote creado correctamente.");

      setForm({
        productoId: "",
        fechaCaducidad: "",
      });

      cargarTodo();
    } catch (err) {
      console.error(err);
      setError("Error al crear el lote.");
    }

    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este lote?")) return;

    try {
      await deleteLote(id);
      cargarTodo();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el lote.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-24 text-white">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <CalendarDays size={30} className="text-blue-400" />
        Gestión de Lotes
      </h1>

      {/* FORMULARIO DE CREACIÓN */}
      <div className="max-w-xl bg-slate-800/70 border border-slate-700 rounded-xl shadow-xl p-6 mb-10 w-full">
        
        {/* ALERTAS */}
        {error && (
          <div className="bg-red-600/80 border border-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/80 border border-green-500 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* PRODUCTO */}
        <label className="text-slate-300 text-sm mb-1 block">Producto</label>
        <select
          name="productoId"
          value={form.productoId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
        >
          <option value="">Seleccione un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* FECHA DE CADUCIDAD */}
        <label className="text-slate-300 text-sm mb-1 block">
          Fecha de Caducidad
        </label>
        <input
          type="date"
          name="fechaCaducidad"
          value={form.fechaCaducidad}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold shadow-md shadow-blue-500/20 transition"
        >
          {loading ? "Procesando..." : "Crear Lote"}
        </button>
      </div>

      {/* LISTA DE LOTES */}
      <div className="w-full max-w-3xl grid gap-4">
        {lotes.map((lote) => (
          <div
            key={lote.id}
            className="bg-slate-800/60 border border-slate-700 p-5 rounded-xl shadow-md hover:shadow-blue-500/10 transition flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PackagePlus size={20} className="text-blue-400" />
                {lote.codigoLote}
              </h2>

              <p className="text-slate-300 text-sm mt-1">
                Producto: {lote.producto?.nombre}
              </p>

              <p className="text-slate-300 text-sm">
                Vence:{" "}
                {new Date(lote.fechaCaducidad).toLocaleDateString("es-CL")}
              </p>
            </div>

            <button
              onClick={() => handleDelete(lote.id)}
              className="text-red-500 hover:text-red-400 transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Estilos input-dark si los necesitas */}
      <style>{`
        .input-dark {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #0f172a;
          border: 1px solid #334155;
          color: white;
        }
        .input-dark:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getProductos } from "../services/productosServices";
import { getLotesByProducto } from "../services/lotesServices";
import { getBodegas } from "../services/bodegasServices";
import { getUbicacionesByBodega } from "../services/ubicacionesServices";
import { ingresarStock } from "../services/inventarioServices";
import { PackagePlus, Warehouse } from "lucide-react";

export default function IngresarStockView() {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    productoId: "",
    loteId: "",
    bodegaId: "",
    ubicacionId: "",
    cantidad: "",
  });

  useEffect(() => {
    cargarProductos();
    cargarBodegas();
  }, []);

  const cargarProductos = async () => setProductos(await getProductos());
  const cargarBodegas = async () => setBodegas(await getBodegas());

  useEffect(() => {
    if (form.productoId) cargarLotes(form.productoId);
    else setLotes([]);
  }, [form.productoId]);

  const cargarLotes = async (productoId: string) =>
    setLotes(await getLotesByProducto(productoId));

  useEffect(() => {
    if (form.bodegaId) cargarUbicaciones(form.bodegaId);
    else setUbicaciones([]);
  }, [form.bodegaId]);

  const cargarUbicaciones = async (bodegaId: string) =>
    setUbicaciones(await getUbicacionesByBodega(bodegaId));

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !form.productoId ||
      !form.loteId ||
      !form.bodegaId ||
      !form.ubicacionId ||
      !form.cantidad
    ) {
      setError("Debe completar todos los campos.");
      setLoading(false);
      return;
    }

    const payload = {
      productoId: Number(form.productoId),
      loteId: Number(form.loteId),
      bodegaId: Number(form.bodegaId),
      ubicacionId: Number(form.ubicacionId),
      cantidad: Number(form.cantidad),
    };

    const res = await ingresarStock(payload);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setSuccess("Stock ingresado correctamente.");

    setForm({
      productoId: "",
      loteId: "",
      bodegaId: "",
      ubicacionId: "",
      cantidad: "",
    });

    setLotes([]);
    setUbicaciones([]);
  };

  return (
<div className="min-h-screen flex flex-col items-center justify-start p-6 pt-24 text-white">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <PackagePlus size={30} className="text-blue-400" />
        Ingresar Stock
      </h1>

      <div className="max-w-xl bg-slate-800/70 border border-slate-700 rounded-xl shadow-xl p-6">
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

        {/* LOTE */}
        <label className="text-slate-300 text-sm mb-1 block">Lote</label>
        <select
          name="loteId"
          value={form.loteId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
        >
          <option value="">Seleccione un lote</option>
          {lotes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.codigoLote} — vence{" "}
              {new Date(l.fechaCaducidad).toLocaleDateString()}
            </option>
          ))}
        </select>

        {/* BODEGA */}
        <label className="text-slate-300 text-sm mb-1 block flex items-center gap-2">
          <Warehouse size={16} className="text-cyan-300" /> Bodega
        </label>
        <select
          name="bodegaId"
          value={form.bodegaId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
        >
          <option value="">Seleccione bodega</option>
          {bodegas.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>

        {/* UBICACIÓN */}
        <label className="text-slate-300 text-sm mb-1 block">Ubicación</label>
        <select
          name="ubicacionId"
          value={form.ubicacionId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
        >
          <option value="">Seleccione ubicación</option>
          {ubicaciones.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} — {u.pasillo}/{u.seccion}
            </option>
          ))}
        </select>

        {/* CANTIDAD */}
        <label className="text-slate-300 text-sm mb-1 block">Cantidad</label>
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-6"
          placeholder="Cantidad"
        />

        {/* BOTÓN */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold shadow-md shadow-blue-500/20 transition"
        >
          {loading ? "Procesando..." : "Ingresar Stock"}
        </button>
      </div>
    </div>
  );
}

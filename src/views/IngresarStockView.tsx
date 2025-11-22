import { useEffect, useState } from "react";

import { getProductos } from "../services/productosServices";
import { getLotesByProducto } from "../services/lotesServices";
import { getBodegas } from "../services/bodegasServices";
import { getUbicacionesByBodega } from "../services/ubicacionesServices";
import { ingresarStock } from "../services/inventarioServices";

export default function IngresarStockView() {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    productoId: "",
    loteId: "",
    bodegaId: "",
    ubicacionId: "",
    cantidad: "",
  });

  // Cargar productos y bodegas al iniciar
  useEffect(() => {
    cargarProductos();
    cargarBodegas();
  }, []);

  const cargarProductos = async () => {
    const res = await getProductos();
    setProductos(res);
  };

  const cargarBodegas = async () => {
    const res = await getBodegas();
    setBodegas(res);
  };

  // Cargar lotes cuando cambia el producto
  useEffect(() => {
    if (form.productoId) cargarLotes(form.productoId);
  }, [form.productoId]);

  const cargarLotes = async (productoId) => {
    const res = await getLotesByProducto(productoId);
    setLotes(res);
  };

  // Cargar ubicaciones cuando cambia la bodega
  useEffect(() => {
    if (form.bodegaId) cargarUbicaciones(form.bodegaId);
  }, [form.bodegaId]);

  const cargarUbicaciones = async (bodegaId) => {
    const res = await getUbicacionesByBodega(bodegaId);
    setUbicaciones(res);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 // -----------------------------
// ✔ Handle Submit FINAL
// -----------------------------
const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  setSuccess(null);

  // VALIDAR CAMPOS OBLIGATORIOS
  if (
    !form.productoId ||
    !form.loteId ||
    !form.bodegaId ||
    !form.ubicacionId ||
    !form.cantidad
  ) {
    setError("Debe completar todos los campos antes de ingresar stock.");
    setLoading(false);
    return;
  }

  // CREAR PAYLOAD NUMÉRICO
  const payload = {
    productoId: Number(form.productoId),
    loteId: Number(form.loteId),
    bodegaId: Number(form.bodegaId),
    ubicacionId: Number(form.ubicacionId),
    cantidad: Number(form.cantidad),
  };

  const res = await ingresarStock(payload);

  setLoading(false);

  // RESPUESTA: ERROR
  if (!res.ok) {
    setError(res.error);
    return;
  }

  // RESPUESTA: ÉXITO
  setSuccess("Stock ingresado correctamente");

  // RESET FORMULARIO
  setForm({
    productoId: "",
    loteId: "",
    bodegaId: "",
    ubicacionId: "",
    cantidad: "",
  });

  // Reset de selects dependientes
  setLotes([]);
  setUbicaciones([]);
};

  return (
    <div className="p-5 text-white">
      <h1 className="text-2xl mb-5">Ingresar Stock</h1>

      {/* Errores y mensajes */}
      {error && (
        <div className="bg-red-600 p-3 rounded mb-3">{error}</div>
      )}

      {success && (
        <div className="bg-green-600 p-3 rounded mb-3">{success}</div>
      )}

      {/* Producto */}
      <select
        name="productoId"
        value={form.productoId}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800"
      >
        <option value="">Seleccione un producto</option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      {/* Lote */}
      <select
        name="loteId"
        value={form.loteId}
        onChange={handleChange}
        className="w-full p-2 mt-3 rounded bg-gray-800"
      >
        <option value="">Seleccione un lote</option>
        {lotes.map((l) => (
          <option key={l.id} value={l.id}>
            {l.codigoLote} — vence{" "}
            {new Date(l.fechaCaducidad).toLocaleDateString()}
          </option>
        ))}
      </select>

      {/* Bodega */}
      <select
        name="bodegaId"
        value={form.bodegaId}
        onChange={handleChange}
        className="w-full p-2 mt-3 rounded bg-gray-800"
      >
        <option value="">Seleccione bodega</option>
        {bodegas.map((b) => (
          <option key={b.id} value={b.id}>
            {b.nombre}
          </option>
        ))}
      </select>

      {/* Ubicación */}
      <select
        name="ubicacionId"
        value={form.ubicacionId}
        onChange={handleChange}
        className="w-full p-2 mt-3 rounded bg-gray-800"
      >
        <option value="">Seleccione ubicación</option>
        {ubicaciones.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre} — {u.pasillo} / {u.seccion}
          </option>
        ))}
      </select>

      {/* Cantidad */}
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        placeholder="Cantidad"
        onChange={handleChange}
        className="w-full p-2 mt-3 rounded bg-gray-800"
      />

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 p-3 rounded"
      >
        {loading ? "Procesando..." : "Ingresar Stock"}
      </button>
    </div>
  );
}

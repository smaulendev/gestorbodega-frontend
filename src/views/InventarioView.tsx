import { useEffect, useState } from "react";
import { getInventario } from "../services/inventarioServices";
import { getProductos } from "../services/productosServices";
import { getBodegas } from "../services/bodegasServices";
import { getLotes } from "../services/lotesServices";

export default function InventarioView() {
  const [items, setItems] = useState([]);

  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [lotes, setLotes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    productoId: "",
    bodegaId: "",
    loteId: "",
    estado: "",
  });

  // ===================================================================
  // 🔵 CARGA DE FILTROS
  // ===================================================================
  useEffect(() => {
    cargarFiltros();
    cargarInventario();
  }, []);

  const cargarFiltros = async () => {
    try {
      setProductos(await getProductos());
      setBodegas(await getBodegas());
      setLotes(await getLotes());
    } catch (err) {
      console.error("Error cargando filtros:", err);
    }
  };

  // ===================================================================
  // 🔵 CARGAR INVENTARIO + FILTROS
  // ===================================================================
  const cargarInventario = async (override = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = { ...filters, ...override };

      // Eliminar filtros vacíos
      Object.keys(params).forEach(
        (key) => (params[key] === "" || params[key] == null) && delete params[key]
      );

      const res = await getInventario(params);

      if (!res.ok) {
        setError("Error cargando inventario.");
        setItems([]);
      } else {
        setItems(res.data);
      }
    } catch (err) {
      setError("No se pudo obtener el inventario.");
    }

    setLoading(false);
  };

  // ===================================================================
  // 🔵 HANDLE CHANGE
  // ===================================================================
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => cargarInventario();

  const limpiarFiltros = () => {
    const limpio = {
      productoId: "",
      bodegaId: "",
      loteId: "",
      estado: "",
    };
    setFilters(limpio);
    cargarInventario(limpio);
  };

  // ===================================================================
  // 🔵 FUNCIÓN PARA ASIGNAR CLASE SEGÚN ESTADO
  // ===================================================================
  const estadoClass = (estado) => {
    if (estado === "Disponible") return "estado-disponible";
    if (estado === "Reservado") return "estado-reservado";
    return "estado-transito"; // cualquier otro será tránsito
  };

  // ===================================================================
  // 🔵 RENDER
  // ===================================================================
  return (
    <div className="p-5 text-white">
      <h1 className="text-2xl mb-5">Inventario General</h1>

      {/* ===================== FILTROS ===================== */}
      <div className="bg-gray-800 p-4 rounded mb-5">
        <div className="grid grid-cols-4 gap-4">

          {/* Producto */}
          <select
            name="productoId"
            value={filters.productoId}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700"
          >
            <option value="">Producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          {/* Bodega */}
          <select
            name="bodegaId"
            value={filters.bodegaId}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700"
          >
            <option value="">Bodega</option>
            {bodegas.map((b) => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>

          {/* Lote */}
          <select
            name="loteId"
            value={filters.loteId}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700"
          >
            <option value="">Lote</option>
            {lotes.map((l) => (
              <option key={l.id} value={l.id}>{l.codigoLote}</option>
            ))}
          </select>

          {/* Estado */}
          <select
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700"
          >
            <option value="">Estado</option>
            <option value="Disponible">Disponible</option>
            <option value="Reservado">Reservado</option>
            <option value="Transito">En tránsito</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button onClick={aplicarFiltros} className="bg-blue-600 p-2 px-4 rounded">
            Aplicar
          </button>
          <button onClick={limpiarFiltros} className="bg-gray-500 p-2 px-4 rounded">
            Limpiar
          </button>
        </div>
      </div>

      {/* ===================== LOADING ===================== */}
      {loading && <p className="text-gray-400 text-lg">Cargando inventario...</p>}

      {/* ===================== ERROR ===================== */}
      {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}

      {/* ===================== INVENTARIO ===================== */}
      {!loading &&
        items.map((inv) => (
          <div key={inv.id} className="bg-gray-800 p-5 rounded mb-4">

            {/* Nombre + Estado */}
            <p className="text-xl font-bold flex justify-between">
              <span>{inv.producto.nombre} — {inv.lote.codigoLote}</span>

              <span className={estadoClass(inv.estadoStock)}>
                {inv.estadoStock}
              </span>
            </p>

            <p>Vence: {new Date(inv.lote.fechaCaducidad).toLocaleDateString()}</p>
            <p><strong>Bodega:</strong> {inv.bodega.nombre}</p>
            <p><strong>Ubicación:</strong> {inv.ubicacion.nombre}</p>

            <div className="mt-2">
              <p><strong>Cantidad total:</strong> {inv.cantidad}</p>
              <p><strong>Disponible:</strong> {inv.cantidadDisponible}</p>
              <p><strong>Reservada:</strong> {inv.cantidadReservada}</p>
              <p><strong>En tránsito:</strong> {inv.cantidadTransito}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

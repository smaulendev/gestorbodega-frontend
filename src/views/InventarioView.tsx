import { useEffect, useState } from "react";
import {
  getInventario,
  getInventarioFiltrado,
} from "../services/inventarioServices";
import { getProductos } from "../services/productosServices";
import { getBodegas } from "../services/bodegasServices";
import { getLotes } from "../services/lotesServices";
import { Layers, Package, Warehouse, ListFilter, Download } from "lucide-react";

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

  const [exportMenu, setExportMenu] = useState(false);

  // INIT LOAD
  useEffect(() => {
    cargarFiltros();
    cargarInventarioGeneral();
  }, []);

  const cargarFiltros = async () => {
    try {
      const [prods, bodeg, lotesList] = await Promise.all([
        getProductos(),
        getBodegas(),
        getLotes(),
      ]);

      setProductos(prods);
      setBodegas(bodeg);
      setLotes(lotesList);
    } catch (err) {
      console.error("Error cargando filtros:", err);
    }
  };

  const cargarInventarioGeneral = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getInventario();
      if (!res.ok) {
        setError("Error cargando inventario general.");
        setItems([]);
      } else {
        setItems(res.data);
      }
    } catch (err) {
      setError("No se pudo obtener el inventario general.");
    }

    setLoading(false);
  };

  const cargarInventarioFiltrado = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { ...filters };
      Object.keys(params).forEach(
        (key) => (params[key] === "" || params[key] == null) && delete params[key]
      );

      const res = await getInventarioFiltrado(params);

      if (!res.ok) {
        setError("Error cargando inventario filtrado.");
        setItems([]);
      } else {
        setItems(res.data);
      }
    } catch (err) {
      setError("No se pudo obtener el inventario filtrado.");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => cargarInventarioFiltrado();

  const limpiarFiltros = () => {
    setFilters({
      productoId: "",
      bodegaId: "",
      loteId: "",
      estado: "",
    });

    cargarInventarioGeneral();
  };

  const estadoClass = (estado) => {
    if (estado === "Disponible") return "text-green-400 font-semibold";
    if (estado === "Reservado") return "text-yellow-400 font-semibold";
    return "text-blue-400 font-semibold";
  };

  const exportar = (formato) => {
    window.open(`http://localhost:3000/inventario/export?format=${formato}`);
    setExportMenu(false);
  };

  // ===================== RENDER ===================== //

  return (
    <div className="p-6 text-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Layers size={28} className="text-blue-400" />
          Inventario General
        </h1>

        {/* Botón Exportar */}
        <div className="relative">
          <button
            onClick={() => setExportMenu(!exportMenu)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition"
          >
            <Download size={18} />
            Exportar
          </button>

          {exportMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
              <button
                className="block px-4 py-2 w-full text-left hover:bg-slate-700"
                onClick={() => exportar("csv")}
              >
                Exportar CSV
              </button>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-slate-700"
                onClick={() => exportar("xlsx")}
              >
                Exportar XLSX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =============== FILTROS =============== */}
      <div className="bg-[#1e293b]/80 border border-[#334155] p-5 rounded-xl shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ListFilter size={20} className="text-blue-300" />
          <h2 className="text-xl font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="productoId"
            value={filters.productoId}
            onChange={handleChange}
            className="input-dark"
          >
            <option value="">Producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            name="bodegaId"
            value={filters.bodegaId}
            onChange={handleChange}
            className="input-dark"
          >
            <option value="">Bodega</option>
            {bodegas.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>

          <select
            name="loteId"
            value={filters.loteId}
            onChange={handleChange}
            className="input-dark"
          >
            <option value="">Lote</option>
            {lotes.map((l) => (
              <option key={l.id} value={l.id}>
                {l.codigoLote}
              </option>
            ))}
          </select>

          <select
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="input-dark"
          >
            <option value="">Estado</option>
            <option value="Disponible">Disponible</option>
            <option value="Reservado">Reservado</option>
            <option value="Transito">En tránsito</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button onClick={aplicarFiltros} className="btn-blue">
            Aplicar filtros
          </button>

          <button onClick={limpiarFiltros} className="btn-gray">
            Limpiar
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 text-lg">Cargando inventario...</p>
      )}

      {/* ERROR */}
      {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}

      {/* INVENTARIO LIST */}
      {!loading && items.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No hay resultados.
        </p>
      )}

      <div className="grid gap-4">
        {!loading &&
          items.map((inv) => (
            <div
              key={inv.id}
              className="bg-[#1e293b]/70 border border-[#334155] p-5 rounded-xl shadow-lg hover:shadow-blue-500/10 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} className="text-blue-400" />
                  {inv.producto?.nombre} — {inv.lote?.codigoLote}
                </h2>

                <span className={estadoClass(inv.estadoStock)}>
                  {inv.estadoStock}
                </span>
              </div>

              <p className="text-gray-300">
                <strong>Vence:</strong>{" "}
                {new Date(inv.lote?.fechaCaducidad).toLocaleDateString()}
              </p>

              <p className="text-gray-300 flex items-center gap-2 mt-1">
                <Warehouse size={16} className="text-cyan-400" />
                <strong>Bodega:</strong> {inv.bodega?.nombre}
              </p>

              <p className="text-gray-300 mt-1">
                <strong>Ubicación:</strong> {inv.ubicacion?.nombre}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm text-gray-300">
                <p>
                  <strong>Total:</strong> {inv.cantidad}
                </p>
                <p>
                  <strong>Disponible:</strong> {inv.cantidadDisponible}
                </p>
                <p>
                  <strong>Reservada:</strong> {inv.cantidadReservada}
                </p>
                <p>
                  <strong>En tránsito:</strong> {inv.cantidadTransito}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* === ESTILOS REUSABLES === */}
      <style>{`
        .input-dark {
          padding: 10px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          color: white;
        }

        .btn-blue {
          background: #3b82f6;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          transition: 0.2s;
        }
        .btn-blue:hover {
          background: #2563eb;
        }

        .btn-gray {
          background: #475569;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          transition: 0.2s;
        }
        .btn-gray:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}

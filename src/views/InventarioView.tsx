import { useEffect, useState } from "react";
import {
  getInventario,
  getInventarioFiltrado,
  ajustarStock,
} from "../services/inventarioServices";
import { getProductos } from "../services/productosServices";
import { getBodegas } from "../services/bodegasServices";
import { getLotes } from "../services/lotesServices";
import { Layers, Package, Warehouse, ListFilter, Download } from "lucide-react";

export default function InventarioView() {
  const [items, setItems] = useState<any[]>([]);

  const [productos, setProductos] = useState<any[]>([]);
  const [bodegas, setBodegas] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    productoId: "",
    bodegaId: "",
    loteId: "",
    estado: "",
  });

  const [exportMenu, setExportMenu] = useState(false);

  // ====== ESTADO PARA AJUSTAR STOCK ======
  const [ajusteOpen, setAjusteOpen] = useState(false);
  const [ajusteTipo, setAjusteTipo] = useState<"POS" | "NEG">("POS");
  const [ajusteCantidad, setAjusteCantidad] = useState(1);
  const [ajusteMotivo, setAjusteMotivo] = useState("");
  const [itemSeleccionado, setItemSeleccionado] = useState<any | null>(null);
  const [loadingAjuste, setLoadingAjuste] = useState(false);

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
      const params: any = { ...filters };
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

  const handleChange = (e: any) => {
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

  const estadoClass = (estado: string) => {
    if (estado === "Disponible") return "text-green-400 font-semibold";
    if (estado === "Reservado") return "text-yellow-400 font-semibold";
    if (estado === "Agotado") return "text-red-400 font-semibold";
    return "text-blue-400 font-semibold";
  };

  const exportar = (formato: string) => {
    window.open(`http://localhost:3000/inventario/export?format=${formato}`);
    setExportMenu(false);
  };

  // ====== LÓGICA AJUSTE STOCK ======

  const openAjusteModal = (inv: any, tipo: "POS" | "NEG") => {
    setItemSeleccionado(inv);
    setAjusteTipo(tipo);
    setAjusteCantidad(1);
    setAjusteMotivo("");
    setAjusteOpen(true);
  };

  const handleConfirmarAjuste = async () => {
    if (!itemSeleccionado) return;
    if (ajusteCantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      setLoadingAjuste(true);

      const res = await ajustarStock(itemSeleccionado.id, {
        cantidad: ajusteCantidad,
        tipo: ajusteTipo,
        motivo:
          ajusteMotivo ||
          (ajusteTipo === "POS"
            ? "Ajuste positivo de stock"
            : "Ajuste negativo de stock"),
      });

      if (!res.ok) {
        alert(res.error);
        return;
      }

      const actualizado = res.data.inventarioActualizado ?? res.data;

      // Actualizar el item en el estado
      setItems((prev) =>
        prev.map((it) => (it.id === actualizado.id ? actualizado : it))
      );

      setAjusteOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al ajustar stock");
    } finally {
      setLoadingAjuste(false);
    }
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
            {productos.map((p: any) => (
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
            {bodegas.map((b: any) => (
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
            {lotes.map((l: any) => (
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
          items.map((inv: any) => (
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

              {/* BOTONES AJUSTE STOCK */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-3 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => openAjusteModal(inv, "POS")}
                >
                  + Agregar
                </button>
                <button
                  className="px-3 py-1 text-xs rounded-md bg-red-600 hover:bg-red-500"
                  onClick={() => openAjusteModal(inv, "NEG")}
                >
                  − Quitar
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* MODAL AJUSTE */}
      {ajusteOpen && itemSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 shadow-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {ajusteTipo === "POS" ? "Agregar stock" : "Quitar stock"}
            </h3>

            <p className="text-sm text-slate-300 mb-3">
              <span className="font-medium">
                {itemSeleccionado.producto?.nombre} —{" "}
                {itemSeleccionado.lote?.codigoLote}
              </span>
              <br />
              Disponible actual:{" "}
              <span className="font-mono">
                {itemSeleccionado.cantidadDisponible}
              </span>
            </p>

            <label className="block text-sm text-slate-200 mb-2">
              Cantidad
              <input
                type="number"
                min={1}
                value={ajusteCantidad}
                onChange={(e) => setAjusteCantidad(Number(e.target.value))}
                className="mt-1 w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block text-sm text-slate-200 mb-4">
              Motivo (opcional)
              <input
                type="text"
                value={ajusteMotivo}
                onChange={(e) => setAjusteMotivo(e.target.value)}
                placeholder="Ajuste por conteo físico..."
                className="mt-1 w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-md text-sm bg-slate-700 text-white hover:bg-slate-600"
                onClick={() => setAjusteOpen(false)}
                disabled={loadingAjuste}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
                onClick={handleConfirmarAjuste}
                disabled={loadingAjuste}
              >
                {loadingAjuste ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

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

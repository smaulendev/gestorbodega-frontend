import { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProductoService,
} from "../services/productosServices";
import { Package, PackagePlus, Pencil, Trash2 } from "lucide-react";

export default function ProductosView() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nuevo formulario alineado al backend
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    esConsumible: false,
    costoUnitario: "",
    precioSugerido: "",
  });

  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar productos.");
    }
    setLoading(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      setError("Debe ingresar un nombre.");
      return;
    }
    if (!form.categoria.trim()) {
      setError("Debe ingresar una categoría.");
      return;
    }
    if (form.costoUnitario === "") {
      setError("Debe ingresar un costo unitario.");
      return;
    }
    if (form.precioSugerido === "") {
      setError("Debe ingresar un precio sugerido.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        esConsumible: form.esConsumible === true || form.esConsumible === "true",
        costoUnitario: Number(form.costoUnitario),
        precioSugerido: Number(form.precioSugerido),
      };

      if (editId) {
        await updateProducto(editId, payload);
        setSuccess("Producto actualizado correctamente.");
      } else {
        await createProducto(payload);
        setSuccess("Producto creado con éxito.");
      }

      // Reset form
      setForm({
        nombre: "",
        categoria: "",
        esConsumible: false,
        costoUnitario: "",
        precioSugerido: "",
      });
      setEditId(null);
      cargarProductos();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el producto.");
    }

    setLoading(false);
  };

  const handleEdit = (prod) => {
    setForm({
      nombre: prod.nombre,
      categoria: prod.categoria ?? "",
      esConsumible: prod.esConsumible ?? false,
      costoUnitario: prod.costoUnitario ?? "",
      precioSugerido: prod.precioSugerido ?? "",
    });
    setEditId(prod.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await deleteProductoService(id);
      cargarProductos();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="min-h-screen p-6 pt-24 text-white flex flex-col items-center">
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <PackagePlus size={30} className="text-blue-400" />
        Gestión de Productos
      </h1>

      {/* CARD FORMULARIO */}
      <div className="w-full max-w-xl bg-slate-800/70 border border-slate-700 p-6 rounded-xl shadow-lg mb-10">
        
        {error && (
          <div className="bg-red-600/80 border border-red-500 p-3 rounded text-sm mb-3">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/80 border border-green-500 p-3 rounded text-sm mb-3">
            {success}
          </div>
        )}

        {/* NOMBRE */}
        <label className="text-slate-300 text-sm mb-1 block">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="input-dark mb-4"
          placeholder="Nombre del producto"
        />

        {/* CATEGORÍA */}
        <label className="text-slate-300 text-sm mb-1 block">Categoría</label>
        <input
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="input-dark mb-4"
          placeholder="Ej: Guantes, Insumos, Materiales..."
        />

        {/* CONSUMIBLE */}
        <label className="text-slate-300 text-sm mb-1 block">¿Es consumible?</label>
        <select
          name="esConsumible"
          value={form.esConsumible ? "true" : "false"}
          onChange={(e) =>
            setForm({ ...form, esConsumible: e.target.value === "true" })
          }
          className="input-dark mb-4"
        >
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>

        {/* COSTO UNITARIO */}
        <label className="text-slate-300 text-sm mb-1 block">Costo Unitario</label>
        <input
          type="number"
          name="costoUnitario"
          value={form.costoUnitario}
          onChange={handleChange}
          className="input-dark mb-4"
          placeholder="0"
        />

        {/* PRECIO SUGERIDO */}
        <label className="text-slate-300 text-sm mb-1 block">Precio Sugerido</label>
        <input
          type="number"
          name="precioSugerido"
          value={form.precioSugerido}
          onChange={handleChange}
          className="input-dark mb-6"
          placeholder="0"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/20 transition"
        >
          {editId ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="w-full max-w-4xl grid gap-4">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-800/60 border border-slate-700 p-5 rounded-xl shadow-md hover:shadow-blue-500/10 transition flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package size={20} className="text-blue-400" />
                {prod.nombre}
              </h2>

              <p className="text-slate-300 text-sm mt-1">Categoría: {prod.categoria}</p>
              <p className="text-slate-300 text-sm">Costo: ${prod.costoUnitario}</p>
              <p className="text-slate-300 text-sm">Precio sugerido: ${prod.precioSugerido}</p>
              <p className="text-slate-300 text-sm">
                Consumible: {prod.esConsumible ? "Sí" : "No"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(prod)}
                className="text-yellow-400 hover:text-yellow-300 transition"
              >
                <Pencil size={20} />
              </button>

              <button
                onClick={() => handleDelete(prod.id)}
                className="text-red-500 hover:text-red-400 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estilos Tailwind personalizados */}
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

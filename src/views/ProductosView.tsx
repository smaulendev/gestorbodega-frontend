import { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProductoService,
} from "../services/productosServices";

import { ProductoCard, ProductoForm } from "../components/productos";

type Producto = {
  id: number;
  sku: string;
  nombre: string;
  categoria?: string;
  esConsumible: boolean;
  costoUnitario: number;
  precioSugerido: number;
};

export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [form, setForm] = useState({
    sku: "",
    nombre: "",
    categoria: "",
    esConsumible: false,
    costoUnitario: "",
    precioSugerido: "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState<number | null>(null);

  // Cargar productos
  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Manejo de formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Crear o actualizar producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: form.sku,
      nombre: form.nombre,
      categoria: form.categoria,
      esConsumible: form.esConsumible,
      costoUnitario: Number(form.costoUnitario),
      precioSugerido: Number(form.precioSugerido),
    };

    if (modoEdicion && productoId) {
      await updateProducto(productoId, payload);
    } else {
      await createProducto(payload);
    }

    await cargarProductos();
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setForm({
      sku: "",
      nombre: "",
      categoria: "",
      esConsumible: false,
      costoUnitario: "",
      precioSugerido: "",
    });
    setModoEdicion(false);
    setProductoId(null);
  };

  // Editar producto
  const handleEdit = (p: Producto) => {
    setForm({
      sku: p.sku,
      nombre: p.nombre,
      categoria: p.categoria || "",
      esConsumible: p.esConsumible,
      costoUnitario: p.costoUnitario.toString(),
      precioSugerido: p.precioSugerido.toString(),
    });

    setProductoId(p.id);
    setModoEdicion(true);
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;

    await deleteProductoService(id);
    await cargarProductos();
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Productos</h1>

      {/* FORMULARIO COMPONENTE */}
      <div className="max-w-lg">
        <ProductoForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          modoEdicion={modoEdicion}
          onCancel={resetForm}
        />
      </div>

      {/* LISTADO COMPONENTE */}
      <div className="mt-10 max-w-xl">
        <ul className="space-y-4">
          {productos.map((p) => (
            <ProductoCard
              key={p.id}
              producto={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

import type { Producto } from "../../types/Producto";

type Props = {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
};

export default function ProductoCard({ producto, onEdit, onDelete }: Props) {
  return (
    <li className="border p-3 rounded bg-white text-black shadow">
      <strong>{producto.nombre}</strong> (SKU: {producto.sku}) <br />
      Categoría: {producto.categoria || "N/A"} <br />
      Consumible: {producto.esConsumible ? "Sí" : "No"} <br />
      Costo: ${producto.costoUnitario} — Precio Sugerido: $
      {producto.precioSugerido}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onEdit(producto)}
          className="text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(producto.id)}
          className="text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}

import type { ChangeEvent, FormEvent } from "react";
import type { Producto } from "../../types/Producto";

type Props = {
  form: {
    numero: string;
    fechaExpiracion: string;
    productoId: string;
  };
  productos: Producto[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
};

export default function LoteForm({ form, productos, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow text-black space-y-3 max-w-md">
      <input
        name="numero"
        value={form.numero}
        onChange={onChange}
        placeholder="Número de lote"
        className="border p-2 w-full"
        required
      />

      <input
        type="date"
        name="fechaExpiracion"
        value={form.fechaExpiracion}
        onChange={onChange}
        className="border p-2 w-full"
        required
      />

      <select
        name="productoId"
        value={form.productoId}
        onChange={onChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Seleccionar producto</option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
      >
        Crear Lote
      </button>
    </form>
  );
}

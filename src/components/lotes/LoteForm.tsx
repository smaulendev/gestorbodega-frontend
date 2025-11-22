import React from "react";

interface Props {
  form: any;
  productos: any[];
  onChange: any;
  onSubmit: any;
}

export default function LoteForm({ form, productos, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-800 p-4 rounded-lg shadow-md space-y-4 max-w-md"
    >
      <div>
        <label className="text-sm font-semibold">Producto</label>
        <select
          name="productoId"
          value={form.productoId}
          onChange={onChange}
          className="w-full p-2 bg-gray-700 text-white rounded"
          required
        >
          <option value="">Seleccione</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Fecha de Caducidad</label>
        <input
          type="date"
          name="fechaCaducidad"
          value={form.fechaCaducidad}
          onChange={onChange}
          className="w-full p-2 bg-gray-700 text-white rounded"
          required
        />
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
        Crear Lote
      </button>
    </form>
  );
}

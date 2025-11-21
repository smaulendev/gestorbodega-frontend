type FormProducto = {
  sku: string;
  nombre: string;
  categoria: string;
  esConsumible: boolean;
  costoUnitario: string;
  precioSugerido: string;
};

type Props = {
  form: FormProducto;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  modoEdicion: boolean;
  onCancel: () => void;
};

export default function ProductoForm({
  form,
  onChange,
  onSubmit,
  modoEdicion,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white text-black p-4 rounded shadow space-y-3 max-w-md"
    >
      <input
        name="sku"
        value={form.sku}
        onChange={onChange}
        placeholder="SKU"
        className="border p-2 w-full"
        required
      />

      <input
        name="nombre"
        value={form.nombre}
        onChange={onChange}
        placeholder="Nombre"
        className="border p-2 w-full"
        required
      />

      <input
        name="categoria"
        value={form.categoria}
        onChange={onChange}
        placeholder="Categoría"
        className="border p-2 w-full"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="esConsumible"
          checked={form.esConsumible}
          onChange={onChange}
        />
        Es consumible
      </label>

      <input
        name="costoUnitario"
        value={form.costoUnitario}
        onChange={onChange}
        type="number"
        min="0"
        step="0.01"
        placeholder="Costo Unitario"
        className="border p-2 w-full"
        required
      />

      <input
        name="precioSugerido"
        value={form.precioSugerido}
        onChange={onChange}
        type="number"
        min="0"
        step="0.01"
        placeholder="Precio Sugerido"
        className="border p-2 w-full"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {modoEdicion ? "Actualizar" : "Crear"} Producto
        </button>

        {modoEdicion && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

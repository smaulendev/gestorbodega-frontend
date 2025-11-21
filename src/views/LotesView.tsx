import { useEffect, useState } from "react";
import { getLotes, createLote, deleteLote } from "../services/lotesServices";
import { getProductos } from "../services/productosServices";

import { LoteForm, LoteCard } from "../components/lotes";
import type { Lote } from "../types/Lote";
import type { Producto } from "../types/Producto";

export default function LotesView() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [form, setForm] = useState({
    numero: "",
    fechaExpiracion: "",
    productoId: "",
  });

  const loadData = async () => {
    setLotes(await getLotes());
    setProductos(await getProductos());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await createLote({
      numero: form.numero,
      fechaExpiracion: form.fechaExpiracion,
      productoId: Number(form.productoId),
    });

    setForm({ numero: "", fechaExpiracion: "", productoId: "" });

    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar lote?")) return;
    await deleteLote(id);
    loadData();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Lotes</h1>

      <LoteForm
        form={form}
        productos={productos}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <ul className="space-y-2 max-w-md mt-6">
        {lotes.map((l) => (
          <LoteCard key={l.id} lote={l} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

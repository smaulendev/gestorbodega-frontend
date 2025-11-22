import { useEffect, useState } from "react";
import { getLotes, createLote, deleteLote } from "../services/lotesServices";
import { getProductos } from "../services/productosServices";
import LoteForm from "../components/lotes/LoteForm";
import LoteCard from "../components/lotes/LoteCard";

export default function LotesView() {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    productoId: "",
    fechaCaducidad: "",
  });

  const cargarTodo = async () => {
    setLotes(await getLotes());
    setProductos(await getProductos());
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createLote({
      productoId: Number(form.productoId),
      fechaCaducidad: form.fechaCaducidad,
    });

    await cargarTodo();
    setForm({ productoId: "", fechaCaducidad: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar lote?")) return;
    await deleteLote(id);
    await cargarTodo();
  };

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Lotes</h1>

      <LoteForm
        form={form}
        productos={productos}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <ul className="space-y-3">
        {lotes.map((lote) => (
          <LoteCard key={lote.id} lote={lote} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

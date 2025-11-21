import type { Lote } from "../../types/Lote";

type Props = {
  lote: Lote;
  onDelete: (id: number) => void;
};

export default function LoteCard({ lote, onDelete }: Props) {
  return (
    <li className="border p-3 rounded bg-white text-black shadow">
      <strong>Lote {lote.numero}</strong> <br />
      Expira: {new Date(lote.fechaExpiracion).toLocaleDateString()} <br />
      Producto: {lote.producto?.nombre || "N/A"}

      <div className="mt-2">
        <button
          onClick={() => onDelete(lote.id)}
          className="text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}

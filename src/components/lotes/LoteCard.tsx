import React from "react";

export default function LoteCard({ lote, onDelete }) {
  return (
    <li className="bg-gray-800 p-4 rounded-lg shadow text-white">
      <p><strong>Código:</strong> {lote.codigoLote}</p>
      <p><strong>Producto:</strong> {lote.producto?.nombre}</p>
      <p>
        <strong>Caducidad:</strong>{" "}
        {new Date(lote.fechaCaducidad).toLocaleDateString()}
      </p>

      <button
        className="mt-3 text-red-400 hover:text-red-600"
        onClick={() => onDelete(lote.id)}
      >
        Eliminar
      </button>
    </li>
  );
}

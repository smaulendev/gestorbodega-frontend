import { Link } from "react-router-dom";
import { Boxes, ClipboardCheck, ArrowLeftRight, PackagePlus, Home } from "lucide-react";

export function Sidebar({ rol }: { rol?: string }) {
  return (
    <div className="w-64 bg-white shadow-lg border-r p-5 flex flex-col gap-6">

      <h1 className="text-2xl font-bold text-blue-600">Bodega FEFO</h1>

      <nav className="flex flex-col gap-4 text-gray-700">

        <Link className="flex items-center gap-3 hover:text-blue-600" to="/dashboard">
          <Home size={20} /> Dashboard
        </Link>

        {/* ADMIN + OPERARIO */}
        {(rol === "ADMIN" || rol === "OPERARIO") && (
          <>
            <Link className="flex items-center gap-3 hover:text-blue-600" to="/inventario">
              <Boxes size={20} /> Inventario
            </Link>

            <Link className="flex items-center gap-3 hover:text-blue-600" to="/ingresar-stock">
              <PackagePlus size={20} /> Ingresar Stock
            </Link>

            <Link className="flex items-center gap-3 hover:text-blue-600" to="/picking-fefo">
              <ClipboardCheck size={20} /> Picking FEFO
            </Link>
          </>
        )}

        {/* ADMIN */}
        {rol === "ADMIN" && (
          <Link className="flex items-center gap-3 hover:text-blue-600" to="/movimientos">
            <ArrowLeftRight size={20} /> Movimientos
          </Link>
        )}

      </nav>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-blue-400">
          Bodega <span className="text-white">FEFO</span>
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/bodegas">Bodegas</Link>
            <Link to="/inventario">Inventario</Link>
            <Link to="/picking-fefo">Picking FEFO</Link>

            {(user?.rol === "ADMIN" || user?.rol === "VENDEDOR") && (
              <Link to="/productos">Productos</Link>
            )}

            {user?.rol === "ADMIN" && (
              <>
                <Link to="/lotes">Lotes</Link>
                <Link to="/ingresar-stock">Ingresar Stock</Link>
                <Link to="/transferencias">Transferencias</Link>
                <Link to="/movimientos">Movimientos</Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-300">
              {user?.nombre} ({user?.rol})
            </span>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
            >
              Cerrar Sesión
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

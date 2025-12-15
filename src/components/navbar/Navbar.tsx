import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Boxes,
  Home,
  ClipboardCheck,
  Package,
  PackagePlus,
  Layers,
  ArrowLeftRight,
  ListOrdered,
  LogOut,
  Menu,
  X,
  Users, // 👈 NUEVO ICONO
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-[#0f172a] border-b border-[#1e293b] px-6 py-3 text-white relative">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-400 hover:text-blue-300 transition"
        >
          <Boxes size={26} />
          FEFO
        </Link>

        {/* BOTÓN HAMBURGER (MÓVIL) */}
        {isAuthenticated && (
          <button
            className="md:hidden p-2 rounded hover:bg-[#1e293b] transition"
            onClick={toggleMenu}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}

        {/* MENÚ DESKTOP */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link className="nav-item" to="/bodegas">
              <Home size={18} /> Bodegas
            </Link>

            <Link className="nav-item" to="/inventario">
              <Layers size={18} /> Inventario
            </Link>

            <Link className="nav-item" to="/picking-fefo">
              <ClipboardCheck size={18} /> Picking FEFO
            </Link>

            {(user?.rol === "ADMIN" || user?.rol === "VENDEDOR") && (
              <Link className="nav-item" to="/productos">
                <Package size={18} /> Productos
              </Link>
            )}

            {user?.rol === "ADMIN" && (
              <>
                <Link className="nav-item" to="/lotes">
                  <ListOrdered size={18} /> Lotes
                </Link>

                <Link className="nav-item" to="/ingresar-stock">
                  <PackagePlus size={18} /> Ingresar Stock
                </Link>

                <Link className="nav-item" to="/transferencias">
                  <ArrowLeftRight size={18} /> Transferencias
                </Link>

                <Link className="nav-item" to="/movimientos">
                  <Layers size={18} /> Movimientos
                </Link>

                {/* 👇 NUEVO APARTADO SOLO ADMIN */}
                <Link className="nav-item" to="/usuarios">
                  <Users size={18} /> Usuarios
                </Link>
              </>
            )}
          </div>
        )}

        {/* USUARIO + LOGOUT (DESKTOP) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-4 ml-4">
            <span className="text-gray-300 text-sm">
              {user?.nombre}{" "}
              <span className="text-blue-300 font-semibold">
                ({user?.rol})
              </span>
            </span>

            <button onClick={logout} className="btn-logout">
              <LogOut size={16} />
              Salir
            </button>
          </div>
        )}
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="md:hidden bg-[#0f172a] border-t border-[#1e293b] mt-3 py-3 space-y-3 animate-fade-in">
          <Link className="nav-mobile" to="/bodegas" onClick={closeMenu}>
            <Home size={18} /> Bodegas
          </Link>

          <Link className="nav-mobile" to="/inventario" onClick={closeMenu}>
            <Layers size={18} /> Inventario
          </Link>

          <Link className="nav-mobile" to="/picking-fefo" onClick={closeMenu}>
            <ClipboardCheck size={18} /> Picking FEFO
          </Link>

          {(user?.rol === "ADMIN" || user?.rol === "VENDEDOR") && (
            <Link className="nav-mobile" to="/productos" onClick={closeMenu}>
              <Package size={18} /> Productos
            </Link>
          )}

          {user?.rol === "ADMIN" && (
            <>
              <Link className="nav-mobile" to="/lotes" onClick={closeMenu}>
                <ListOrdered size={18} /> Lotes
              </Link>

              <Link
                className="nav-mobile"
                to="/ingresar-stock"
                onClick={closeMenu}
              >
                <PackagePlus size={18} /> Ingresar Stock
              </Link>

              {/* <Link className="nav-mobile" to="/transferencias" onClick={closeMenu}>
                <ArrowLeftRight size={18} /> Transferencias
              </Link> */}

              <Link
                className="nav-mobile"
                to="/movimientos"
                onClick={closeMenu}
              >
                <Layers size={18} /> Movimientos
              </Link>

              {/* 👇 NUEVO EN MÓVIL SOLO ADMIN */}
              <Link className="nav-mobile" to="/usuarios" onClick={closeMenu}>
                <Users size={18} /> Usuarios
              </Link>
            </>
          )}

          <button
            onClick={() => {
              closeMenu();
              logout();
            }}
            className="btn-logout w-full flex justify-center mt-2"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      )}

      {/* ESTILOS REUSABLES */}
      <style>{`
        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #e2e8f0;
          transition: 0.2s;
        }
        .nav-item:hover {
          color: #38bdf8;
        }

        .nav-mobile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          color: #e2e8f0;
          border-radius: 8px;
          margin: 0 10px;
          transition: 0.2s;
        }
        .nav-mobile:hover {
          background: #1e293b;
          color: #38bdf8;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ef4444;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }
        .btn-logout:hover {
          background: #dc2626;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}

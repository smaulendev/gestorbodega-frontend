import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-950 border-b border-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/productos" className="text-xl font-semibold tracking-wide">
          <span className="text-blue-400">Bodega</span> FEFO
        </Link>
        <Link to="/bodegas" className="hover:text-blue-400">Bodegas</Link>
        <Link to="/inventario">Inventario</Link>
        <Link to="/picking-fefo">Picking FEFO</Link>


        {/* MENÚ */}
        <div className="flex items-center gap-6 text-sm">

          {[
            { to: "/productos", label: "Productos" },
            { to: "/lotes", label: "Lotes" },
            { to: "/ingresar-stock", label: "Ingresar Stock" },
            { to: "/transferencias", label: "Transferencias" },
            { to: "/movimientos", label: "Movimientos" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-all hover:text-blue-400 ${
                  isActive ? "text-blue-400 font-semibold underline" : "text-gray-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </div>
      </div>
    </nav>
  );
}

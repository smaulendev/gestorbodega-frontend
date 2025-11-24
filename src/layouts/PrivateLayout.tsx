
// // src/layouts/PrivateLayout.tsx
// import Navbar from "../components/navbar/Navbar";
// import { Outlet } from "react-router-dom";

// export default function PrivateLayout() {
//   return (
//     <>
//       <Navbar />
//       <div className="p-6">
//         <Outlet />
//       </div>
//     </>
//   );
// }
// src/layouts/PrivateLayout.tsx

import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/navbar/Sidebar";
import { Navbar } from "../components/navbar/Navbar";

export default function PrivateLayout() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar rol={user?.rol} />

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1">

        {/* BARRA SUPERIOR */}
        <Navbar />

        {/* CONTENIDO PRINCIPAL */}
        <main className="p-6 overflow-y-auto h-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

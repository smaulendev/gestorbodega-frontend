
// src/layouts/PrivateLayout.tsx
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}

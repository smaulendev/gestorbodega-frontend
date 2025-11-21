import type { Producto } from "./Producto";

export type Lote = {
  id: number;
  numero: string;
  fechaExpiracion: string;
  productoId: number;
  producto?: Producto;
};

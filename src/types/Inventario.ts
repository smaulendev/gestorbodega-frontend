// src/types/Inventario.ts

export interface InventarioItem {
  id: number;
  cantidad: number;
  cantidadDisponible: number;
  cantidadReservada: number;
  cantidadTransito: number;
  estadoStock: string;
  producto: {
    id: number;
    nombre: string;
    sku: string;
  };
  lote: {
    id: number;
    codigoLote: string;
    fechaCaducidad: string;
  };
  bodega: {
    id: number;
    nombre: string;
  };
  ubicacion: {
    id: number;
    nombre: string;
  };
}

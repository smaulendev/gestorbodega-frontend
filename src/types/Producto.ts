export type Producto = {
  id: number;
  sku: string;
  nombre: string;
  categoria?: string;
  esConsumible: boolean;
  costoUnitario: number;
  precioSugerido: number;
};

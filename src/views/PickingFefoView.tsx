import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

// ===== COMPONENTES =====

const Button = (props: any) => (
  <button
    {...props}
    className={`px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full ${
      props.className ?? ""
    }`}
  />
);

const Input = (props: any) => (
  <input
    {...props}
    className={`px-3 py-2 border rounded w-full text-black ${props.className ?? ""}`}
  />
);

const Label = (props: any) => (
  <label
    {...props}
    className={`font-semibold block mb-1 ${props.className ?? ""}`}
  />
);

const Card = (props: any) => (
  <div
    {...props}
    className={`p-4 rounded-xl shadow-md bg-white/10 backdrop-blur border border-white/20 ${
      props.className ?? ""
    }`}
  />
);

// ==================================================

const API = "http://localhost:3000/inventario";

const PickingFefoView: React.FC = () => {
  const [sku, setSku] = useState("");
  const [fefoData, setFefoData] = useState<any>(null);
  const [codigoLoteEscaneado, setCodigoLoteEscaneado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [usandoCamara, setUsandoCamara] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  let qrScanner: Html5Qrcode | null = null;

  // =====================================================
  // 🔹 ABRIR INPUT DE ARCHIVOS
  // =====================================================
  const abrirSelectorArchivo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpiar selección anterior
      fileInputRef.current.click();
    }
  };

  // =====================================================
  // 🔹 PROCESAR IMAGEN (modo archivo)
  // =====================================================
  const procesarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5Qr = new Html5Qrcode("scanner-area");

    try {
      const result = await html5Qr.scanFile(file, true);
      handleScanSku(result);
    } catch (err) {
      alert("No se pudo leer el código QR desde la imagen.");
      console.error(err);
    }
  };

  // =====================================================
  // 🔹 INICIAR CÁMARA
  // =====================================================
  const iniciarCamara = async () => {
    setUsandoCamara(true);

    qrScanner = new Html5Qrcode("scanner-area");

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        alert("No se detectan cámaras en este dispositivo.");
        setUsandoCamara(false);
        return;
      }

      await qrScanner.start(
        devices[0].id,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          qrScanner?.stop();
          setUsandoCamara(false);
          handleScanSku(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
      setUsandoCamara(false);
    }
  };

  // =====================================================
  // 🔹 AL ESCANEAR SKU
  // =====================================================
  const handleScanSku = async (result: string) => {
    if (!result) return;

    setSku(result);
    await obtenerFefo(result);
  };

  // =====================================================
  // 🔹 Obtener FEFO desde backend
  // =====================================================
  const obtenerFefo = async (sku: string) => {
    try {
      const { data } = await axios.get(`${API}/fefo/${sku}`);
      setFefoData(data);
      alert(`Lote sugerido: ${data.sugerido.codigoLote}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "No se pudo obtener FEFO.");
    }
  };

  // =====================================================
  // 🔹 Confirmar picking
  // =====================================================
  const confirmarPicking = async () => {
    if (!fefoData) return alert("Primero escanea un SKU.");

    try {
      const payload = {
        sku,
        codigoLote: codigoLoteEscaneado,
        cantidad,
      };

      const { data } = await axios.post(`${API}/picking`, payload);
      alert(data.message);

      setSku("");
      setCodigoLoteEscaneado("");
      setCantidad(1);
      setFefoData(null);
    } catch (err: any) {
      alert("Error al confirmar picking.");
    }
  };

  // =====================================================
  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="max-w-md w-full space-y-4 bg-white">
        <h2 className="text-xl font-bold text-center">Picking FEFO</h2>

        <Label>Escanear Producto (SKU)</Label>

        {/* BOTONES PARA ELEGIR MODO */}
        <div className="flex gap-3">
          <Button onClick={iniciarCamara}>Usar Cámara</Button>
          <Button onClick={abrirSelectorArchivo}>Subir Imagen</Button>
        </div>

        {/* INPUT OCULTO PARA SUBIR IMAGEN */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={procesarImagen}
        />

        {/* ÁREA DONDE SE RENDERIZA LA CÁMARA O LA IMAGEN */}
        <div id="scanner-area" className="mt-3 w-full"></div>

        {sku && (
          <p className="text-center text-black">
            <strong>SKU escaneado:</strong> {sku}
          </p>
        )}

        {fefoData && (
          <>
            <div className="p-3 border rounded-lg bg-gray-100 text-black space-y-1">
              <p><strong>Lote sugerido:</strong> {fefoData.sugerido.codigoLote}</p>
              <p><strong>Caducidad:</strong> {new Date(fefoData.sugerido.fechaCaducidad).toLocaleDateString()}</p>
              <p><strong>Bodega:</strong> {fefoData.sugerido.bodega}</p>
              <p><strong>Ubicación:</strong> {fefoData.sugerido.ubicacion}</p>
            </div>

            <Label>Confirmar lote escaneado</Label>
            <Input
              placeholder="Código de lote"
              value={codigoLoteEscaneado}
              onChange={(e) => setCodigoLoteEscaneado(e.target.value)}
            />

            <Label>Cantidad</Label>
            <Input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />

            <Button className="mt-4" onClick={confirmarPicking}>
              Confirmar Picking FEFO
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default PickingFefoView;

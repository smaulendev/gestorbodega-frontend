import React, { useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import {
  ScanLine,
  Camera,
  Image as ImageIcon,
  Check,
  PackageSearch,
} from "lucide-react";

const API = "http://localhost:3000/inventario";

export default function PickingFefoView() {
  const [sku, setSku] = useState("");
  const [fefoData, setFefoData] = useState<any>(null);
  const [codigoLoteEscaneado, setCodigoLoteEscaneado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [usandoCamara, setUsandoCamara] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  let qrScanner: Html5Qrcode | null = null;

  // ===========================================
  const abrirSelectorArchivo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const procesarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5Qr = new Html5Qrcode("scanner-area");

    try {
      const result = await html5Qr.scanFile(file, true);
      handleScanSku(result);
    } catch (err) {
      setError("No se pudo leer el código QR desde la imagen.");
    }
  };

  const iniciarCamara = async () => {
    setUsandoCamara(true);

    qrScanner = new Html5Qrcode("scanner-area");

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setError("No hay cámaras disponibles.");
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
        }
      );
    } catch (err) {
      setError("No se pudo iniciar la cámara.");
      setUsandoCamara(false);
    }
  };

  const handleScanSku = async (result: string) => {
    setError(null);
    setSuccess(null);

    setSku(result);
    await obtenerFefo(result);
  };

  const obtenerFefo = async (sku: string) => {
    try {
      const { data } = await axios.get(`${API}/fefo/${sku}`);
      setFefoData(data);
      setSuccess(`Lote sugerido: ${data.sugerido.codigoLote}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se encontró FEFO para este SKU.");
    }
  };

  const confirmarPicking = async () => {
    if (!fefoData) return setError("Primero escanee un SKU.");

    try {
      const payload = {
        sku,
        codigoLote: codigoLoteEscaneado,
        cantidad,
      };

      const { data } = await axios.post(`${API}/picking`, payload);
      setSuccess(data.message);

      setSku("");
      setCodigoLoteEscaneado("");
      setCantidad(1);
      setFefoData(null);
    } catch {
      setError("Error al confirmar el picking.");
    }
  };

  // ==========================================================
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-24 text-white">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <ScanLine size={30} className="text-blue-400" />
        Picking FEFO
      </h1>

      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-xl bg-slate-800/70 border border-slate-700 rounded-xl shadow-xl p-6">

        {/* ALERTAS */}
        {error && (
          <div className="bg-red-600/80 border border-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/80 border border-green-500 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* OPCIONES DE ESCANEO */}
        <label className="text-slate-300 text-sm mb-2 block">Escanear SKU</label>

        <div className="flex gap-3 mb-4">
          <button
            onClick={iniciarCamara}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            <Camera size={18} />
            Usar Cámara
          </button>

          <button
            onClick={abrirSelectorArchivo}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            <ImageIcon size={18} />
            Subir Imagen
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={procesarImagen}
        />

        {/* ÁREA DE ESCANEO */}
        <div
          id="scanner-area"
          className="w-full h-64 bg-black/40 border border-slate-700 rounded-lg mb-4"
        ></div>

        {sku && (
          <p className="text-center text-blue-300">
            <strong>SKU detectado:</strong> {sku}
          </p>
        )}

        {/* RESULTADO FEFO */}
        {fefoData && (
          <div className="mt-5 space-y-4">

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <PackageSearch className="text-blue-400" /> Lote sugerido
              </h3>
              <p className="text-slate-300 mt-1">
                <strong>Código:</strong> {fefoData.sugerido.codigoLote}
              </p>
              <p className="text-slate-300">
                <strong>Caduca:</strong>{" "}
                {new Date(fefoData.sugerido.fechaCaducidad).toLocaleDateString("es-CL")}
              </p>
              <p className="text-slate-300">
                <strong>Bodega:</strong> {fefoData.sugerido.bodega}
              </p>
              <p className="text-slate-300">
                <strong>Ubicación:</strong> {fefoData.sugerido.ubicacion}
              </p>
            </div>

            {/* INGRESAR LOTE */}
            <label className="text-slate-300 text-sm block">Confirmar Lote Escaneado</label>
            <input
              value={codigoLoteEscaneado}
              onChange={(e) => setCodigoLoteEscaneado(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Código de lote"
            />

            {/* CANTIDAD */}
            <label className="text-slate-300 text-sm block mt-2">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              min={1}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {/* CONFIRMAR PICKING */}
            <button
              onClick={confirmarPicking}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg mt-4 font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Confirmar Picking FEFO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

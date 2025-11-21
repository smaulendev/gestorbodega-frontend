import { useEffect, useState } from 'react'
import axios from 'axios'

type Producto = { id: number; nombre: string }
type Lote = { id: number; numero: string }
type Bodega = { id: number; nombre: string }
type Ubicacion = { id: number; nombre: string }

export default function IngresarStockView() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([])

  const [form, setForm] = useState({
    productoId: '',
    loteId: '',
    bodegaId: '',
    ubicacionId: '',
    cantidad: ''
  })

  useEffect(() => {
    axios.get('http://localhost:3000/productos').then(res => setProductos(res.data))
    axios.get('http://localhost:3000/lotes').then(res => setLotes(res.data))
    axios.get('http://localhost:3000/bodegas').then(res => setBodegas(res.data))
    axios.get('http://localhost:3000/ubicaciones').then(res => setUbicaciones(res.data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post('http://localhost:3000/inventario/ingresar', {
      ...form,
      productoId: Number(form.productoId),
      loteId: Number(form.loteId),
      bodegaId: Number(form.bodegaId),
      ubicacionId: Number(form.ubicacionId),
      cantidad: Number(form.cantidad)
    })
    alert('Stock ingresado correctamente')
    setForm({ productoId: '', loteId: '', bodegaId: '', ubicacionId: '', cantidad: '' })
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Ingreso de Stock</h1>

      <form onSubmit={handleSubmit} className="bg-white text-black p-4 rounded space-y-4 max-w-md">
        <select name="productoId" value={form.productoId} onChange={handleChange} className="w-full border p-2" required>
          <option value="">Seleccionar producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <select name="loteId" value={form.loteId} onChange={handleChange} className="w-full border p-2" required>
          <option value="">Seleccionar lote</option>
          {lotes.map(l => (
            <option key={l.id} value={l.id}>{l.numero}</option>
          ))}
        </select>

        <select name="bodegaId" value={form.bodegaId} onChange={handleChange} className="w-full border p-2" required>
          <option value="">Seleccionar bodega</option>
          {bodegas.map(b => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>

        <select name="ubicacionId" value={form.ubicacionId} onChange={handleChange} className="w-full border p-2" required>
          <option value="">Seleccionar ubicación</option>
          {ubicaciones.map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="w-full border p-2"
          required
        />

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">Ingresar Stock</button>
      </form>
    </div>
  )
}

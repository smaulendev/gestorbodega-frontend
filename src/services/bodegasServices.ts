export async function getBodegas() {
  const res = await fetch("http://localhost:3000/bodegas");
  if (!res.ok) throw new Error("Error obteniendo bodegas");
  return res.json();
}

export async function createBodega(data: { nombre: string }) {
  const res = await fetch("http://localhost:3000/bodegas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBodega(id: number) {
  const res = await fetch(`http://localhost:3000/bodegas/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

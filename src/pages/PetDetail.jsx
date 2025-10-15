import Page from '../components/Page.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import { loadPets, getReading, makeAdvice, savePets } from '../mock.js'
import { useEffect, useState } from 'react'
import EditPetModal from '../components/EditPetModal.jsx'
import { Pencil, Trash2 } from 'lucide-react'

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const list = loadPets()
  const pet = list.find(p => p.id === id)
  const [data, setData] = useState({})
  const [openEdit, setOpenEdit] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temp: getReading('temp'),
        hum: getReading('hum'),
        ph: getReading('ph'),
        actividad: getReading('actividad'),
        pulso: getReading('pulso')
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  if (!pet) {
    return <Page title="Mascota no encontrada">No existe.</Page>
  }

  function deletePet() {
    if (confirm(`¿Seguro que deseas borrar a ${pet.nombre}?`)) {
      const updated = list.filter(p => p.id !== pet.id)
      savePets(updated)
      alert(`${pet.nombre} ha sido eliminada.`)
      navigate('/mascotas')
    }
  }

  return (
    <Page title={`Perfil: ${pet.nombre}`}>
      <div className="flex flex-wrap gap-2 justify-end mb-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="px-3 py-2 rounded-xl border hover:bg-emerald-50 flex items-center gap-1 text-sm"
        >
          <Pencil size={16} /> Editar
        </button>
        <button
          onClick={deletePet}
          className="px-3 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1 text-sm"
        >
          <Trash2 size={16} /> Borrar
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-soft p-4 border border-emerald-100 md:col-span-2">
          <p className="font-semibold text-emerald-800">Datos</p>
          <p className="text-sm text-gray-700 mt-1">
            {pet.especie}
            {pet.raza ? ` • ${pet.raza}` : ''} • {pet.edad?.toFixed?.(1)} años • {pet.fase}
            {pet.peso ? ` • ${pet.peso} kg` : ''}
          </p>
          <p className="text-sm text-emerald-700 mt-1">{pet.consejoIA}</p>
          {pet.pesoConsejo ? (
            <p className="text-sm text-emerald-700">{pet.pesoConsejo}</p>
          ) : null}

          <p className="font-semibold text-emerald-800 mt-4">Lecturas en tiempo real (demo)</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
            <div className="p-3 border rounded-xl">🌡️ Temp: {data.temp?.toFixed?.(1)} °C</div>
            <div className="p-3 border rounded-xl">💧 Humedad: {data.hum?.toFixed?.(0)}%</div>
            <div className="p-3 border rounded-xl">💧 pH: {data.ph?.toFixed?.(2)}</div>
            <div className="p-3 border rounded-xl">🏃 Actividad: {data.actividad?.toFixed?.(0)}%</div>
            <div className="p-3 border rounded-xl">❤️ Pulso: {data.pulso?.toFixed?.(0)} bpm</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-4 border border-emerald-100">
          <p className="font-semibold text-emerald-800">Consejo IA</p>
          <p className="text-sm text-gray-700 mt-2">
            {makeAdvice('hum', data.hum ?? 52, pet.especie)}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {makeAdvice('ph', data.ph ?? 7.2, pet.especie)}
          </p>

          {Array.isArray(pet.historial) && pet.historial.length > 0 ? (
            <div className="mt-4">
              <p className="font-semibold text-emerald-800 mb-2">Historial veterinario</p>
              <ul className="text-sm space-y-1">
                {pet.historial.map((h, i) => (
                  <li key={String(i)} className="border-b border-emerald-50 pb-1">
                    <span className="font-medium">{h.tipo}</span> — {h.descripcion}{' '}
                    <span className="text-xs text-gray-500">({h.fecha})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <EditPetModal
        open={openEdit}
        pet={pet}
        onClose={() => setOpenEdit(false)}
        onSaved={() => {}}
      />
    </Page>
  )
}

import { useState } from 'react'
import { Plus, FilePlus } from 'lucide-react'
import { addClinicalNote, addVaccine, addTreatment, addAttachment, loadPets } from '../mock.js'

export default function MedicalTabs({ pet }) {
  const [tab, setTab] = useState('historial')
  const [form, setForm] = useState({
    motivo: '', observaciones: '', vacuna: '', prox: '',
    tratNombre: '', tratDosis: '', tratFreq: '', tratDesde: '', tratHasta: '',
    adjNombre: '', adjUrl: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(v => ({ ...v, [name]: value }))
  }

  function hardRefresh(){
    const list = loadPets()
    const updated = list.find(p => p.id === pet.id)
    if(updated){
      location.replace(`/mascotas/${updated.id}`)
    }
  }

  function submitHistorial(e){
    e.preventDefault()
    addClinicalNote(pet.id, {
      fecha: new Date().toISOString().slice(0,10),
      motivo: form.motivo || 'Consulta',
      observaciones: form.observaciones || ''
    })
    setForm(v=>({ ...v, motivo:'', observaciones:'' }))
    hardRefresh()
  }

  function submitVacuna(e){
    e.preventDefault()
    addVaccine(pet.id, {
      nombre: form.vacuna || 'Vacuna',
      fecha: new Date().toISOString().slice(0,10),
      proxima: form.prox || ''
    })
    setForm(v=>({ ...v, vacuna:'', prox:'' }))
    hardRefresh()
  }

  function submitTratamiento(e){
    e.preventDefault()
    addTreatment(pet.id, {
      nombre: form.tratNombre || 'Tratamiento',
      dosis: form.tratDosis || '',
      frecuencia: form.tratFreq || '',
      desde: form.tratDesde || new Date().toISOString().slice(0,10),
      hasta: form.tratHasta || ''
    })
    setForm(v=>({ ...v, tratNombre:'', tratDosis:'', tratFreq:'', tratDesde:'', tratHasta:'' }))
    hardRefresh()
  }

  function submitAdjunto(e){
    e.preventDefault()
    addAttachment(pet.id, {
      nombre: form.adjNombre || 'Archivo',
      url: form.adjUrl || '#'
    })
    setForm(v=>({ ...v, adjNombre:'', adjUrl:'' }))
    hardRefresh()
  }

  const TabBtn = ({k, children}) => (
    <button onClick={()=>setTab(k)} className={`px-3 py-2 rounded-xl border text-sm ${tab===k?'bg-emerald-600 text-white border-emerald-600':'hover:bg-emerald-50'}`}>{children}</button>
  )

  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 border border-emerald-100">
      <div className="flex flex-wrap gap-2 mb-4">
        <TabBtn k="historial">Historial clínico</TabBtn>
        <TabBtn k="vacunas">Vacunas/Desparasitación</TabBtn>
        <TabBtn k="tratamientos">Tratamientos</TabBtn>
        <TabBtn k="adjuntos">Adjuntos</TabBtn>
      </div>

      {tab==='historial' && (
        <div className="grid gap-4">
          <ul className="text-sm space-y-2">
            {(pet.historialClinico||[]).map((h,i)=>(
              <li key={i} className="border rounded-xl p-3">
                <span className="font-medium">{h.fecha}</span> — {h.motivo}
                {h.observaciones ? <div className="text-gray-700 mt-1">{h.observaciones}</div> : null}
              </li>
            ))}
            {(pet.historialClinico||[]).length===0 && <li className="text-sm text-gray-500">Sin registros todavía.</li>}
          </ul>

          <form onSubmit={submitHistorial} className="grid gap-2">
            <p className="font-semibold text-emerald-800">Añadir nota</p>
            <input name="motivo" value={form.motivo} onChange={handleChange} placeholder="Motivo de la consulta" className="px-3 py-2 rounded-xl border"/>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones..." className="px-3 py-2 rounded-xl border"/>
            <div className="flex justify-end"><button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"><Plus size={16}/> Guardar</button></div>
          </form>
        </div>
      )}

      {tab==='vacunas' && (
        <div className="grid gap-4">
          <ul className="text-sm space-y-2">
            {(pet.vacunas||[]).map((v,i)=>(
              <li key={i} className="border rounded-xl p-3">
                <span className="font-medium">{v.nombre}</span> — {v.fecha}
                {v.proxima ? <span className="text-xs text-gray-500"> (Próxima: {v.proxima})</span> : null}
              </li>
            ))}
            {(pet.vacunas||[]).length===0 && <li className="text-sm text-gray-500">Sin vacunas registradas.</li>}
          </ul>

          <form onSubmit={submitVacuna} className="grid gap-2">
            <p className="font-semibold text-emerald-800">Registrar vacuna/desparasitación</p>
            <input name="vacuna" value={form.vacuna} onChange={handleChange} placeholder="Nombre (p.ej., Antirrábica / Desparasitación)" className="px-3 py-2 rounded-xl border"/>
            <input type="date" name="prox" value={form.prox} onChange={handleChange} className="px-3 py-2 rounded-xl border"/>
            <div className="flex justify-end"><button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"><Plus size={16}/> Guardar</button></div>
          </form>
        </div>
      )}

      {tab==='tratamientos' && (
        <div className="grid gap-4">
          <ul className="text-sm space-y-2">
            {(pet.tratamientos||[]).map((t,i)=>(
              <li key={i} className="border rounded-xl p-3">
                <span className="font-medium">{t.nombre}</span> — {t.dosis} • {t.frecuencia}
                <span className="text-xs text-gray-500"> ({t.desde}{t.hasta?' → '+t.hasta:''})</span>
              </li>
            ))}
            {(pet.tratamientos||[]).length===0 && <li className="text-sm text-gray-500">Sin tratamientos activos.</li>}
          </ul>

          <form onSubmit={submitTratamiento} className="grid gap-2">
            <p className="font-semibold text-emerald-800">Añadir tratamiento</p>
            <input name="tratNombre" value={form.tratNombre} onChange={handleChange} placeholder="Nombre" className="px-3 py-2 rounded-xl border"/>
            <div className="grid grid-cols-2 gap-2">
              <input name="tratDosis" value={form.tratDosis} onChange={handleChange} placeholder="Dosis (p.ej., 250mg)" className="px-3 py-2 rounded-xl border"/>
              <input name="tratFreq" value={form.tratFreq} onChange={handleChange} placeholder="Frecuencia (p.ej., 2/día)" className="px-3 py-2 rounded-xl border"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" name="tratDesde" value={form.tratDesde} onChange={handleChange} className="px-3 py-2 rounded-xl border"/>
              <input type="date" name="tratHasta" value={form.tratHasta} onChange={handleChange} className="px-3 py-2 rounded-xl border"/>
            </div>
            <div className="flex justify-end"><button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"><Plus size={16}/> Guardar</button></div>
          </form>
        </div>
      )}

      {tab==='adjuntos' && (
        <div className="grid gap-4">
          <ul className="text-sm space-y-2">
            {(pet.archivos||[]).map((a,i)=>(
              <li key={i} className="border rounded-xl p-3 flex items-center justify-between">
                <div><span className="font-medium">{a.nombre}</span> — <a className="text-emerald-700 underline" href={a.url} target="_blank" rel="noreferrer">Abrir</a></div>
              </li>
            ))}
            {(pet.archivos||[]).length===0 && <li className="text-sm text-gray-500">Sin adjuntos.</li>}
          </ul>

          <form onSubmit={submitAdjunto} className="grid gap-2">
            <p className="font-semibold text-emerald-800">Añadir adjunto</p>
            <input name="adjNombre" value={form.adjNombre} onChange={handleChange} placeholder="Nombre del archivo" className="px-3 py-2 rounded-xl border"/>
            <input name="adjUrl" value={form.adjUrl} onChange={handleChange} placeholder="URL (demo)" className="px-3 py-2 rounded-xl border"/>
            <div className="flex justify-end"><button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"><FilePlus size={16}/> Guardar</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

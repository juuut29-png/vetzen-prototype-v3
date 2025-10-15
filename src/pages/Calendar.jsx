import Page from '../components/Page.jsx'
import { loadCalendar, addCalendarItem, removeCalendarItem } from '../mock.js'
import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TYPE_OPTIONS=[
  {key:'vacuna', label:'Vacuna', icon:'💉'},
  {key:'desparasitacion', label:'Desparasitación', icon:'💊'},
  {key:'peluqueria', label:'Peluquería', icon:'✂️'},
  {key:'revision', label:'Revisión veterinaria', icon:'🩺'},
  {key:'cita', label:'Cita veterinaria', icon:'🕒'},
  {key:'dental', label:'Limpieza dental', icon:'🦷'},
  {key:'acuario', label:'Mantenimiento acuario', icon:'💧'},
  {key:'otro', label:'Otro', icon:'🐾'},
]
function typeToIcon(t){ return (TYPE_OPTIONS.find(x=>x.key===t)?.icon) || '🐾' }

export default function Calendar(){
  const [list,setList]=useState(loadCalendar())
  const [open,setOpen]=useState(false)
  const [date,setDate]=useState('')
  const [type,setType]=useState('vacuna')
  const [note,setNote]=useState('')

  useEffect(()=>{ const id=setInterval(()=>setList(loadCalendar()),1200); return()=>clearInterval(id) },[])

  function onAdd(e){
    e.preventDefault()
    if(!date || !note){ alert('Añade fecha y descripción'); return }
    addCalendarItem({ id:'evt_'+Date.now(), date, type, note })
    setOpen(false); setDate(''); setType('vacuna'); setNote('')
    setList(loadCalendar())
  }
  function del(id){ removeCalendarItem(id); setList(loadCalendar()) }

  return (<Page title="Calendario" actions={<button onClick={()=>setOpen(true)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2"><Plus size={16}/> Añadir</button>}>
    <div className="bg-white rounded-2xl shadow-soft p-4 border border-emerald-100">
      <ul className="text-sm space-y-2">
        {list.map(e=>(
          <li key={e.id} className="flex items-center gap-2 justify-between border rounded-xl px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="text-lg">{typeToIcon(e.type)}</span>
              <span className="font-medium">{e.date}</span>
              <span>— {e.note}</span>
            </div>
            {String(e.id).startsWith('evt_') && (
              <button onClick={()=>del(e.id)} title="Eliminar" className="text-red-600 hover:scale-105"><Trash2 size={18}/></button>
            )}
          </li>
        ))}
      </ul>
    </div>

    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-emerald-700/10 backdrop-blur-sm" onClick={()=>setOpen(false)}/>
          <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} transition={{duration:.25}} className="absolute left-1/2 top-24 -translate-x-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-soft border border-emerald-100 p-5">
            <div className="text-xl font-extrabold text-emerald-700 mb-2">Añadir recordatorio</div>
            <form onSubmit={onAdd} className="grid gap-3">
              <div>
                <label className="text-sm text-gray-600">Fecha</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <select value={type} onChange={e=>setType(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  {TYPE_OPTIONS.map(o=>(<option key={o.key} value={o.key}>{o.icon} {o.label}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Descripción</label>
                <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ej: Vacuna polivalente (Rocco)" className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-xl border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Guardar</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </Page>)
}

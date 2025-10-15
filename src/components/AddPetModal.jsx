import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { SPECIES, addPet, getPhaseAndAdviceFromDOB } from '../mock.js'
import { BREEDS } from '../data/breeds.js'
import { useMemo, useState } from 'react'

export default function AddPetModal({ open, onClose, onSaved }){
  const [nombre,setNombre]=useState(''); const [especie,setEspecie]=useState('Perro'); const [dob,setDob]=useState(''); const [peso,setPeso]=useState('')
  const [raza,setRaza]=useState(''); const [query,setQuery]=useState('')
  const list = useMemo(()=>BREEDS[especie]||[],[especie])
  const filtered = useMemo(()=>list.filter(b=>b.toLowerCase().includes((query||'').toLowerCase())).slice(0,6),[list,query])
  function pick(b){ setRaza(b); setQuery(b) }
  function save(e){ e.preventDefault(); if(!nombre||!especie||!dob){ alert('Rellena nombre, especie y fecha'); return }
    const c=getPhaseAndAdviceFromDOB(especie,dob,parseFloat(peso||0),raza||query||'')
    const pet={ id:(nombre+'_'+Date.now()).toLowerCase().replace(/\s+/g,'_'), nombre, especie, raza:raza||query||'', dob, peso:parseFloat(peso||0), edad:+c.ageYears.toFixed(1), fase:c.phase, consejoIA:c.advice, pesoEstado:c.weightStatus, pesoConsejo:c.weightAdvice, sensores:[] }
    addPet(pet); onSaved&&onSaved(pet); onClose&&onClose() }
  return (<AnimatePresence>{open&&(<motion.div className='fixed inset-0 z-50' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <div className='absolute inset-0 bg-emerald-700/10 backdrop-blur-sm' onClick={onClose}/>
    <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} transition={{duration:.25}} className='absolute left-1/2 top-24 -translate-x-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-soft border border-emerald-100 p-5'>
      <div className='flex items-center justify-between'><h3 className='text-xl font-extrabold text-emerald-700'>Añadir mascota</h3><button onClick={onClose} className='p-2 rounded-xl hover:bg-emerald-50'><X size={18}/></button></div>
      <form onSubmit={save} className='mt-4 grid gap-3'>
        <div><label className='text-sm text-gray-600'>Nombre</label><input value={nombre} onChange={e=>setNombre(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600'/></div>
        <div><label className='text-sm text-gray-600'>Especie</label><select value={especie} onChange={e=>{setEspecie(e.target.value); setQuery(''); setRaza('')}} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600'>{SPECIES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        <div><label className='text-sm text-gray-600'>Raza / tipo</label>
          <div className='relative'>
            <div className='absolute left-2 top-1/2 -translate-y-1/2'><Search size={16} className='text-gray-400'/></div>
            <input value={query} onChange={e=>{setQuery(e.target.value); setRaza('')}} placeholder='Escribe para buscar…' className='w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600'/>
            {filtered.length>0 && (<div className='absolute z-10 mt-1 w-full bg-white border border-emerald-100 rounded-xl shadow-soft max-h-48 overflow-auto'>{filtered.map(b=>(<button type='button' key={b} onClick={()=>pick(b)} className='w-full text-left px-3 py-2 hover:bg-emerald-50'>{b}</button>))}</div>)}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div><label className='text-sm text-gray-600'>Fecha de nacimiento</label><input type='date' value={dob} onChange={e=>setDob(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600'/></div>
          <div><label className='text-sm text-gray-600'>Peso (kg) — opcional</label><input type='number' step='0.01' value={peso} onChange={e=>setPeso(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600'/></div>
        </div>
        <div className='flex gap-3 justify-end pt-2'><button type='button' onClick={onClose} className='px-4 py-2 rounded-xl border'>Cancelar</button><button type='submit' className='px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700'>Guardar</button></div>
      </form>
    </motion.div></motion.div>)}</AnimatePresence>)
}

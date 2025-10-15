import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { savePets, loadPets, getPhaseAndAdviceFromDOB } from '../mock.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditPetModal({ open, onClose, pet, onSaved }){
  const [nombre, setNombre] = useState(pet?.nombre || '')
  const [raza, setRaza] = useState(pet?.raza || '')
  const [dob, setDob] = useState(pet?.dob || '')
  const [peso, setPeso] = useState(pet?.peso || 0)
  const navigate = useNavigate()

  function save(e){
    e.preventDefault()
    const pets = loadPets()
    const updated = pets.map(p => {
      if(p.id !== pet.id) return p
      const c = getPhaseAndAdviceFromDOB(p.especie, dob, parseFloat(peso || 0), raza)
      return {
        ...p,
        nombre,
        raza,
        dob,
        peso: parseFloat(peso || 0),
        edad: +c.ageYears.toFixed(1),
        fase: c.phase,
        consejoIA: c.advice,
        pesoEstado: c.weightStatus,
        pesoConsejo: c.weightAdvice
      }
    })
    savePets(updated)
    if(onSaved) onSaved()
    onClose()
    navigate(`/mascotas/${pet.id}`) // ✅ navegación interna sin 404
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className='fixed inset-0 z-50' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className='absolute inset-0 bg-emerald-700/10 backdrop-blur-sm' onClick={onClose}/>
          <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} transition={{duration:.25}} className='absolute left-1/2 top-24 -translate-x-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-soft border border-emerald-100 p-5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-extrabold text-emerald-700'>Editar mascota</h3>
              <button onClick={onClose} className='p-2 rounded-xl hover:bg-emerald-50'><X size={18}/></button>
            </div>
            <form onSubmit={save} className='mt-4 grid gap-3'>
              <div>
                <label className='text-sm text-gray-600'>Nombre</label>
                <input value={nombre} onChange={e=>setNombre(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600'/>
              </div>
              <div>
                <label className='text-sm text-gray-600'>Raza / tipo</label>
                <input value={raza} onChange={e=>setRaza(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600'/>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-sm text-gray-600'>Fecha nacimiento</label>
                  <input type='date' value={dob} onChange={e=>setDob(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600'/>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Peso (kg)</label>
                  <input type='number' step='0.01' value={peso} onChange={e=>setPeso(e.target.value)} className='w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600'/>
                </div>
              </div>
              <div className='flex gap-3 justify-end pt-2'>
                <button type='button' onClick={onClose} className='px-4 py-2 rounded-xl border'>Cancelar</button>
                <button type='submit' className='px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700'>Guardar cambios</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

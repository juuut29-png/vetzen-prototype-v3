import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SPECIES, addPet, getPhaseAndAdviceFromDOB } from '../mock.js'
import { BREEDS } from '../data/breeds.js'
import { useState } from 'react'

export default function AddPetModal({ open, onClose, onSaved }) {
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [dob, setDob] = useState('')
  const [peso, setPeso] = useState('')
  const [raza, setRaza] = useState('')
  const [historial, setHistorial] = useState('')
  const [filtro, setFiltro] = useState('')

  const razasDisponibles = BREEDS[especie] || []
  const razasFiltradas = razasDisponibles.filter(r =>
    r.toLowerCase().includes(filtro.toLowerCase())
  )

  function save(e) {
    e.preventDefault()
    if (!nombre || !especie || !dob) {
      alert('Rellena nombre, especie y fecha')
      return
    }

    const parsedHistorial = historial
      ? historial.split(';').map(h => {
          const [tipo, descripcion] = h.split(':').map(s => s.trim())
          return {
            tipo: tipo || 'Nota',
            fecha: new Date().toISOString().slice(0, 10),
            descripcion: descripcion || ''
          }
        })
      : []

    const c = getPhaseAndAdviceFromDOB(especie, dob, parseFloat(peso || 0), raza || '')
    const pet = {
      id: (nombre + '_' + Date.now()).toLowerCase().replace(/\s+/g, '_'),
      nombre,
      especie,
      raza: raza || '',
      dob,
      peso: parseFloat(peso || 0),
      edad: +c.ageYears.toFixed(1),
      fase: c.phase,
      consejoIA: c.advice,
      pesoEstado: c.weightStatus,
      pesoConsejo: c.weightAdvice,
      sensores: [],
      historial: parsedHistorial,
      historialClinico: [],
      vacunas: [],
      tratamientos: [],
      archivos: []
    }

    addPet(pet)
    onSaved && onSaved(pet)
    onClose && onClose()
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0

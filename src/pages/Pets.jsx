import Page from '../components/Page.jsx'
import AddPetModal from '../components/AddPetModal.jsx'
import AddDeviceModal from '../components/AddDeviceModal.jsx'
import { loadPets } from '../mock.js'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Pets(){
  const [pets,setPets]=useState(loadPets())
  const [openAdd,setOpenAdd]=useState(False)
  const [openDev,setOpenDev]=useState(False)
  const [activePet,setActivePet]=useState(null)
  useEffect(()=>{const id=setInterval(()=>setPets(loadPets()),1200); return()=>clearInterval(id)},[])
  return(<Page title='Mis mascotas' actions={<button onClick={()=>setOpenAdd(true)} className='px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700'>➕ Añadir mascota</button>}>
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {pets.map(p=>(
        <div key={p.id} className='bg-white rounded-2xl shadow-soft p-4 border border-emerald-100'>
          <Link to={`/mascotas/${p.id}`} className='block'>
            <p className='font-semibold text-emerald-800'>{p.nombre}</p>
            <p className='text-xs text-gray-500'>{p.especie} {p.raza?`• ${p.raza}`:''} • {p.edad?.toFixed?.(1)} años • {p.fase}</p>
            {p.peso?<p className='text-xs text-gray-500'>Peso: {p.peso} kg — {p.pesoEstado}</p>:<p className='text-xs text-gray-400'>Peso no indicado</p>}
            <p className='text-xs text-emerald-700 mt-1'>{p.consejoIA}</p>
            {p.pesoConsejo&&<p className='text-xs text-emerald-700'>{p.pesoConsejo}</p>}
          </Link>
          <div className='mt-3 flex gap-2'>
            <button onClick={()=>{setActivePet(p); setOpenDev(true)}} className='px-3 py-2 text-sm rounded-xl border hover:bg-emerald-50'>⚙️ Configurar dispositivo</button>
          </div>
        </div>
      ))}
    </div>
    <AddPetModal open={openAdd} onClose={()=>setOpenAdd(false)} onSaved={()=>setPets(loadPets())}/>
    <AddDeviceModal open={openDev} pet={activePet} onClose={()=>setOpenDev(False)} onSaved={()=>{}}/>
  </Page>) }

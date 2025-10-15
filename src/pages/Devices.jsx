import Page from '../components/Page.jsx'
import { loadDevices, removeDevice } from '../mock.js'
import { useEffect, useState } from 'react'
import { XCircle } from 'lucide-react'
export default function Devices(){
  const [list,setList]=useState(loadDevices())
  useEffect(()=>{const id=setInterval(()=>setList(loadDevices()),900); return()=>clearInterval(id)},[])
  function del(id){ if(confirm('¿Eliminar este dispositivo?')){ removeDevice(id); setList(loadDevices()) } }
  return(<Page title='Dispositivos conectados'>
    {list.length===0&&<p className='text-sm text-gray-500'>Aún no hay dispositivos vinculados. Ve a “Mis mascotas” → ⚙️ Configurar.</p>}
    <div className='grid md:grid-cols-2 gap-4'>
      {list.map(d=>(
        <div key={d.id} className='relative bg-white rounded-2xl shadow-soft p-4 border border-emerald-100'>
          <button onClick={()=>del(d.id)} className='absolute -right-2 -top-2 text-red-600 hover:scale-105' title='Eliminar'><XCircle size={22}/></button>
          <p className='font-semibold text-emerald-800'>{d.mascota}</p>
          <p className='text-sm text-gray-600'>{d.tipo}</p>
          <p className='text-xs text-gray-500 mt-1'>Métricas: {d.metricas.join(', ')}</p>
          <p className='text-xs text-gray-500'>Conexión: {d.conexion}</p>
        </div>
      ))}
    </div>
  </Page>) }

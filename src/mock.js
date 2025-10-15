// =========================
// 🐾 VetZen — Mock de datos
// =========================

const PETS_KEY = 'vetzen_pets_v3'
const DEVICES_KEY = 'vetzen_devices_v3'
const CALENDAR_KEY = 'vetzen_calendar_v3'

export const SPECIES = [
  'Perro','Gato','Reptil','Pez','Conejo','Ave','Roedor'
]

// 🐾 Mascotas base de ejemplo (solo se cargan si no hay en localStorage)
const basePets = [
  { id:'mia', nombre:'Mia', especie:'Gato', raza:'Gato común europeo', dob:'2022-08-10', peso:4.3 },
  { id:'rocco', nombre:'Rocco', especie:'Perro', raza:'Cruce mediano', dob:'2020-06-02', peso:18.2 },
  { id:'draco', nombre:'Draco', especie:'Reptil', raza:'Gecko leopardo', dob:'2019-03-12', peso:0.25 },
  { id:'nemo', nombre:'Nemo', especie:'Pez', raza:'Betta', dob:'2024-01-05', peso:0.05 },
]

// =========================
// 🧠 Cálculos de edad, fase, peso
// =========================

export function yearsFromDOB(d){
  if(!d) return 0
  const b = new Date(d + 'T00:00:00')
  return (new Date() - b) / (1000*60*60*24*365.25)
}

export function getPhaseBySpecies(e,y){
  switch(e){
    case 'Perro': return y<1?'Cachorro':y<8?'Adulto':'Senior'
    case 'Gato': return y<1?'Cachorro':y<10?'Adulto':'Senior'
    case 'Reptil': return y<2?'Joven':y<6?'Adulto':'Senior'
    case 'Pez': return y<1?'Joven':y<3?'Adulto':'Senior'
    case 'Conejo': return y<1?'Joven':y<5?'Adulto':'Senior'
    case 'Ave': return y<2?'Joven':y<10?'Adulto':'Senior'
    case 'Roedor': return y<0.5?'Joven':y<2?'Adulto':'Senior'
    default: return y<1?'Joven':'Adulto'
  }
}

export function getWeightStatus(e,p,ra=''){
  if(!p||p<=0) return {status:'Desconocido',advice:'Añade el peso para recomendaciones precisas.'}
  const r = (ra||'').toLowerCase()
  if(e==='Perro'){
    let low=10, high=25
    if(r.includes('peque')||r.includes('chihuahua')||r.includes('pomerania')){low=2;high=8}
    else if(r.includes('mediano')||r.includes('beagle')||r.includes('bulldog')){low=8;high=25}
    else if(r.includes('grande')||r.includes('pastor')||r.includes('labrador')||r.includes('golden')){low=25;high=45}
    if(p<low) return {status:'Bajo peso',advice:'Aumenta ración progresivamente y revisa parásitos.'}
    if(p>high) return {status:'Sobrepeso',advice:'Reduce calorías un 10% y aumenta ejercicio.'}
    return {status:'Ideal',advice:'Mantén ejercicio diario y dieta equilibrada.'}
  }
  if(e==='Gato'){
    if(p<3) return {status:'Bajo peso',advice:'Aumenta comidas y revisa salud dental.'}
    if(p>6) return {status:'Sobrepeso',advice:'Controla calorías y fomenta juego.'}
    return {status:'Ideal',advice:'Alimentación balanceada.'}
  }
  if(e==='Conejo'){
    if(p<1) return {status:'Bajo peso',advice:'Heno ilimitado y revisar dientes.'}
    if(p>2.5) return {status:'Sobrepeso',advice:'Reduce pienso y ofrece forraje.'}
    return {status:'Ideal',advice:'Buena rutina.'}
  }
  if(e==='Reptil'){
    if(p<0.2) return {status:'Bajo peso',advice:'Optimiza temperatura/humedad y alimentación viva.'}
    if(p>0.6) return {status:'Sobrepeso',advice:'Reduce raciones y fomenta actividad.'}
    return {status:'Ideal',advice:'Parámetros correctos.'}
  }
  if(e==='Pez'){
    if(p>0.2) return {status:'Sobrepeso',advice:'Evita sobrealimentar, pequeñas tomas.'}
    return {status:'Ideal',advice:'Mantén pH estable.'}
  }
  if(e==='Ave'){
    if(p>1) return {status:'Sobrepeso',advice:'Evita semillas grasas y promueve vuelo.'}
    return {status:'Ideal',advice:'Mixtura equilibrada.'}
  }
  if(e==='Roedor'){
    if(p>0.15) return {status:'Sobrepeso',advice:'Reduce snacks y promueve actividad.'}
    return {status:'Ideal',advice:'Buena alimentación.'}
  }
  return {status:'Ideal',advice:'Valores generales correctos.'}
}

export function getPhaseAndAdviceFromDOB(e,d,p,ra=''){
  const y = yearsFromDOB(d)
  const phase = getPhaseBySpecies(e,y)
  const {status:weightStatus,advice:weightAdvice} = getWeightStatus(e,p||0,ra)
  let advice = ''
  if(phase==='Cachorro'||

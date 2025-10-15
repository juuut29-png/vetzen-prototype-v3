// =========================
// 🐾 VetZen — Mock de datos
// =========================

const PETS_KEY = 'vetzen_pets_v3'
const DEVICES_KEY = 'vetzen_devices_v3'
const CALENDAR_KEY = 'vetzen_calendar_v3'

export const SPECIES = [
  'Perro', 'Gato', 'Reptil', 'Pez', 'Conejo', 'Ave', 'Roedor'
]

// Mascotas base
const basePets = [
  { id: 'mia', nombre: 'Mia', especie: 'Gato', raza: 'Europeo', dob: '2022-08-10', peso: 4.3 },
  { id: 'rocco', nombre: 'Rocco', especie: 'Perro', raza: 'Cruce mediano', dob: '2020-06-02', peso: 18.2 },
  { id: 'draco', nombre: 'Draco', especie: 'Reptil', raza: 'Gecko leopardo', dob: '2019-03-12', peso: 0.25 },
  { id: 'nemo', nombre: 'Nemo', especie: 'Pez', raza: 'Betta', dob: '2024-01-05', peso: 0.05 }
]

// =========================
// Utilidades
// =========================

export function yearsFromDOB(d) {
  if (!d) return 0
  const b = new Date(d + 'T00:00:00')
  return (Date.now() - b) / (1000 * 60 * 60 * 24 * 365.25)
}

export function getPhaseBySpecies(e, y) {
  switch (e) {
    case 'Perro': return y < 1 ? 'Cachorro' : y < 8 ? 'Adulto' : 'Senior'
    case 'Gato': return y < 1 ? 'Cachorro' : y < 10 ? 'Adulto' : 'Senior'
    case 'Reptil': return y < 2 ? 'Joven' : y < 6 ? 'Adulto' : 'Senior'
    case 'Pez': return y < 1 ? 'Joven' : y < 3 ? 'Adulto' : 'Senior'
    case 'Conejo': return y < 1 ? 'Joven' : y < 5 ? 'Adulto' : 'Senior'
    case 'Ave': return y < 2 ? 'Joven' : y < 10 ? 'Adulto' : 'Senior'
    case 'Roedor': return y < 0.5 ? 'Joven' : y < 2 ? 'Adulto' : 'Senior'
    default: return y < 1 ? 'Joven' : 'Adulto'
  }
}

export function getWeightStatus(e, p, ra = '') {
  if (!p || p <= 0) return { status: 'Desconocido', advice: 'Añade el peso para recomendaciones precisas.' }
  const r = ra.toLowerCase()
  if (e === 'Perro') {
    let low = 10, high = 25
    if (r.includes('peque') || r.includes('chihuahua')) { low = 2; high = 8 }
    else if (r.includes('mediano')) { low = 8; high = 25 }
    else if (r.includes('grande') || r.includes('pastor') || r.includes('labrador')) { low = 25; high = 45 }
    if (p < low) return { status: 'Bajo peso', advice: 'Aumenta la ración.' }
    if (p > high) return { status: 'Sobrepeso', advice: 'Reduce calorías y aumenta ejercicio.' }
    return { status: 'Ideal', advice: 'Mantén ejercicio y dieta equilibrada.' }
  }
  if (e === 'Gato') {
    if (p < 3) return { status: 'Bajo peso', advice: 'Aumenta comidas.' }
    if (p > 6) return { status: 'Sobrepeso', advice: 'Controla calorías.' }
    return { status: 'Ideal', advice: 'Buena alimentación.' }
  }
  return { status: 'Ideal', advice: 'Valores correctos.' }
}

export function getPhaseAndAdviceFromDOB(e, d, p, ra = '') {
  const y = yearsFromDOB(d)
  const phase = getPhaseBySpecies(e, y)
  const { status: weightStatus, advice: weightAdvice } = getWeightStatus(e, p, ra)
  let advice = ''
  if (phase === 'Cachorro' || phase === 'Joven') advice = 'Vacunas y socialización.'
  else if (phase === 'Adulto') advice = 'Chequeo anual.'
  else if (phase === 'Senior') advice = 'Revisiones semestrales.'
  return { ageYears: y, phase, advice, weightStatus, weightAdvice }
}

// =========================
// Mascotas (CRUD)
// =========================

export function loadPets() {
  let stored = []
  try { stored = JSON.parse(localStorage.getItem(PETS_KEY) || '[]') } catch {}
  const list = stored.length > 0 ? stored : basePets
  return list.map(p => {
    const c = getPhaseAndAdviceFromDOB(p.especie, p.dob, p.peso || 0, p.raza || '')
    return {
      ...p,
      edad: +c.ageYears.toFixed(1),
      fase: c.phase,
      consejoIA: c.advice,
      pesoEstado: c.weightStatus,
      pesoConsejo: c.weightAdvice,
      sensores: p.sensores || [],
      historial: p.historial || []
    }
  })
}

export function savePets(a) {
  localStorage.setItem(PETS_KEY, JSON.stringify(a))
}

export function addPet(p) {
  const a = JSON.parse(localStorage.getItem(PETS_KEY) || '[]')
  a.unshift(p)
  savePets(a)
}

// =========================
// Dispositivos
// =========================

export function loadDevices() {
  try { return JSON.parse(localStorage.getItem(DEVICES_KEY) || '[]') } catch { return [] }
}

export function saveDevices(a) {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(a))
}

export function addDevice(d) {
  const a = loadDevices()
  a.unshift(d)
  saveDevices(a)
}

export function removeDevice(id) {
  const a = loadDevices().filter(x => x.id !== id)
  saveDevices(a)
}

export function getPetsWithDevices() {
  const devs = loadDevices()
  const pets = loadPets()
  const map = new Map()
  devs.forEach(d => {
    const arr = map.get(d.petId) || []
    arr.push(d)
    map.set(d.petId, arr)
  })
  return pets.filter(p => map.has(p.id)).map(p => ({ ...p, dispositivos: map.get(p.id) }))
}

// =========================
// Calendario
// =========================

const baseCalendar = [
  { id: 'c1', date: '2025-10-18', type: 'vacuna', note: 'Vacuna rabia (Mia)' },
  { id: 'c2', date: '2025-10-25', type: 'desparasitacion', note: 'Desparasitación (Rocco)' },
  { id: 'c3', date: '2025-10-28', type: 'acuario', note: 'Cambio de agua (Nemo)' }
]

export function loadCalendar() {
  let user = []
  try { user = JSON.parse(localStorage.getItem(CALENDAR_KEY) || '[]') } catch {}
  return [...baseCalendar, ...user]
}

export function addCalendarItem(it) {
  const arr = loadUserCalendarOnly()
  arr.unshift(it)
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(arr))
}

export function removeCalendarItem(id) {
  const arr = loadUserCalendarOnly().filter(e => e.id !== id)
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(arr))
}

function loadUserCalendarOnly() {
  try { return JSON.parse(localStorage.getItem(CALENDAR_KEY) || '[]') } catch { return [] }
}

// =========================
// Lecturas simuladas
// =========================

export function getReading(k) {
  const s = state
  switch (k) {
    case 'temp': s.temp = jitter(s.temp, 0.6); return s.temp
    case 'hum': s.hum = clamp(jitter(s.hum, 3), 20, 90); return s.hum
    case 'ph': s.ph = clamp(jitter(s.ph, 0.15), 5.5, 8.5); return s.ph
    case 'actividad': s.actividad = clamp(jitter(s.actividad, 5), 0, 100); return s.actividad
    case 'pulso': s.pulso = clamp(jitter(s.pulso, 4), 50, 180); return s.pulso
    default: return 0
  }
}

const state = { temp: 27.0, hum: 52, ph: 7.2, actividad: 64, pulso: 85 }
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const jitter = (n, d) => +(n + (Math.random() * d * 2 - d)).toFixed(2)

export function makeAdvice(metric, value, species) {
  if (metric === 'hum' && value < 45) return 'Humedad baja.'
  if (metric === 'hum' && value > 70) return 'Humedad alta.'
  if (metric === 'temp' && value < 24 && species === 'Reptil') return 'Temperatura baja.'
  if (metric === 'ph' && value < 6.5) return 'pH bajo.'
  if (metric === 'ph' && value > 7.8) return 'pH alto.'
  if (metric === 'pulso' && value > 140) return 'Pulso elevado.'
  return 'Valores normales.'
}

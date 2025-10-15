export function loadPets(){
  let stored = []
  try {
    stored = JSON.parse(localStorage.getItem(PETS_KEY) || '[]')
  } catch {}

  // 🟢 Si no hay nada en localStorage, usa los basePets como demo
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
      sensores: p.sensores || []
    }
  })
}

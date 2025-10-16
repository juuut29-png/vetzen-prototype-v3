<div>
  <label className="text-sm text-gray-600">Raza / tipo</label>
  {BREEDS[especie] ? (
    <div className="relative">
      <input
        value={filtro || raza}
        onChange={e => setFiltro(e.target.value)}
        onFocus={() => setFiltro(' ')} // 👈 muestra todas al enfocar
        placeholder="Escribe para buscar o selecciona una raza"
        className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
      />
      {BREEDS[especie]
        .filter(r =>
          r.toLowerCase().includes(filtro.trim().toLowerCase())
        )
        .slice(0, 30) // evita listas enormes
        .length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-emerald-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {BREEDS[especie]
            .filter(r =>
              r.toLowerCase().includes(filtro.trim().toLowerCase())
            )
            .slice(0, 30)
            .map(r => (
              <li
                key={r}
                onMouseDown={() => {
                  setRaza(r)
                  setFiltro('')
                }}
                className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm"
              >
                {r}
              </li>
            ))}
        </ul>
      )}
    </div>
  ) : (
    <input
      value={raza}
      onChange={e => setRaza(e.target.value)}
      placeholder="Escribe la raza o tipo"
      className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
    />
  )}
</div>

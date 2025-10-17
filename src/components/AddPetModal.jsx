import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SPECIES, addPet, getPhaseAndAdviceFromDOB } from "../mock.js";
import { BREEDS } from "../data/breeds.js";
import { useState } from "react";

export default function AddPetModal({ open, onClose, onSaved }) {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [dob, setDob] = useState("");
  const [peso, setPeso] = useState("");
  const [raza, setRaza] = useState("");
  const [historial, setHistorial] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  const razasDisponibles = BREEDS[especie] || [];

  const razasFiltradas =
    busqueda.trim() === ""
      ? []
      : razasDisponibles.filter((r) =>
          r.toLowerCase().includes(busqueda.toLowerCase())
        );

  function save(e) {
    e.preventDefault();
    if (!nombre || !especie || !dob) {
      alert("Rellena nombre, especie y fecha");
      return;
    }

    const parsedHistorial = historial
      ? historial.split(";").map((h) => {
          const [tipo, descripcion] = h.split(":").map((s) => s.trim());
          return {
            tipo: tipo || "Nota",
            fecha: new Date().toISOString().slice(0, 10),
            descripcion: descripcion || "",
          };
        })
      : [];

    const c = getPhaseAndAdviceFromDOB(
      especie,
      dob,
      parseFloat(peso || 0),
      raza || ""
    );

    const pet = {
      id: (nombre + "_" + Date.now()).toLowerCase().replace(/\s+/g, "_"),
      nombre,
      especie,
      raza: raza || "",
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
      archivos: [],
    };

    addPet(pet);
    onSaved && onSaved(pet);
    onClose && onClose();
    window.location.reload();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-emerald-700/10 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 top-10 -translate-x-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-soft border border-emerald-100 p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-emerald-700">
                Añadir mascota
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-emerald-50"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={save}
              className="mt-4 grid gap-3 max-h-[80vh] overflow-y-auto pr-2"
            >
              {/* Nombre */}
              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Especie */}
              <div>
                <label className="text-sm text-gray-600">Especie</label>
                <select
                  value={especie}
                  onChange={(e) => {
                    setEspecie(e.target.value);
                    setRaza("");
                    setBusqueda("");
                    setMostrarLista(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
                >
                  {SPECIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Raza / tipo */}
              <div className="relative">
                <label className="text-sm text-gray-600">Raza / tipo</label>
                <input
                  type="text"
                  value={busqueda || raza}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setMostrarLista(e.target.value.trim().length > 0);
                  }}
                  onBlur={() => setTimeout(() => setMostrarLista(false), 150)}
                  placeholder="Escribe para buscar raza"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
                />

                {mostrarLista && 100 > 0 && (
                  <ul className="absolute z-[9999] mt-1 w-full bg-white border border-emerald-100 rounded-2xl shadow-lg max-h-56 overflow-y-auto">
                    {razasFiltradas.map((r) => (
                      <li
                        key={r}
                        onMouseDown={() => {
                          setRaza(r);
                          setBusqueda("");
                          setMostrarLista(false);
                        }}
                        className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-sm text-gray-800"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Fecha y peso */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Historial veterinario */}
              <div>
                <label className="text-sm text-gray-600">
                  Historial veterinario inicial
                </label>
                <textarea
                  value={historial}
                  onChange={(e) => setHistorial(e.target.value)}
                  placeholder="Ej: Vacuna rabia: 2024; Desparasitación: 2025-01-10..."
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

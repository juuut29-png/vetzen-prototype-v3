import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { addDevice } from "../mock.js";
import { useState, useEffect } from "react";

export default function AddDeviceModal({ open, onClose, pet, onSaved }) {
  const [tipo, setTipo] = useState("Sensor de terrario");
  const [conexion, setConexion] = useState("Bluetooth");
  const [metricas, setMetricas] = useState(["temp", "hum"]);

  const presets = {
    "Sensor de terrario": ["temp", "hum"],
    "Sensor acuario": ["ph", "temp"],
    "Collar inteligente": ["pulso", "actividad"],
    "Monitor de actividad": ["actividad"],
  };

  useEffect(() => {
    const m = presets[tipo] || ["temp", "hum"];
    setMetricas(m);
  }, [tipo]);

  function save(e) {
    e.preventDefault();
    const d = {
      id: "dev_" + Date.now(),
      mascota: pet?.nombre || "Sin asignar",
      petId: pet?.id || null,
      tipo,
      conexion,
      metricas,
    };
    addDevice(d);
    if (onSaved) onSaved(d);
    if (onClose) onClose();
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
            className="absolute left-1/2 top-24 -translate-x-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-soft border border-emerald-100 p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-emerald-700">
                Vincular dispositivo
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-emerald-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={save} className="mt-4 grid gap-3">
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option>Collar inteligente</option>
                  <option>Sensor de terrario</option>
                  <option>Sensor acuario</option>
                  <option>Monitor de actividad</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Conexión</label>
                <select
                  value={conexion}
                  onChange={(e) => setConexion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option>Bluetooth</option>
                  <option>WiFi</option>
                  <option>USB</option>
                  <option>Otros</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Métricas a registrar
                </label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {metricas.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl"
                    >
                      <input type="checkbox" checked readOnly />
                      {m.toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se ajusta automáticamente según el tipo de dispositivo.
                </p>
              </div>

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

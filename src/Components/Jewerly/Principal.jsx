import { useState } from "react";
import Nav from '../../Components/General/Nav'

const DEFAULT_ITEMS = [
  { id: 1, name: "Cola Rosa", emoji: "🎀", category: "Cola" },
  { id: 2, name: "Gancho Premium", emoji: "✨", category: "Gancho" },
  { id: 3, name: "Pulsera Dorada", emoji: "💛", category: "Pulsera" },
  { id: 4, name: "Set Infantil", emoji: "🌸", category: "Set" }
];

const PLANS = {
  bronce: {
    name: "Bronce",
    options: [
      { price: 5, turns: 3 },
      { price: 10, turns: 7 },
      { price: 15, turns: 10 }
    ]
  },
  oro: {
    name: "Oro",
    options: [
      { price: 10, turns: 7 },
      { price: 20, turns: 15 },
      { price: 30, turns: 25 }
    ]
  },
  platino: {
    name: "Platino",
    options: [
      { price: 20, turns: 15 },
      { price: 40, turns: 35 },
      { price: 60, turns: 60 }
    ]
  }
};

export default function Principal() {
  const [view, setView] = useState("game");
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [turnsUsed, setTurnsUsed] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  const turnsTotal = selectedOption ? selectedOption.turns : 0;

  const spin = () => {
    if (!selectedOption) return;
    if (spinning || turnsUsed >= turnsTotal) return;

    setSpinning(true);
    let ticks = 0;

    const interval = setInterval(() => {
      setCurrent(items[Math.floor(Math.random() * items.length)]);
      ticks++;
      if (ticks > 12) {
        clearInterval(interval);
        const prize = items[Math.floor(Math.random() * items.length)];
        setCurrent(prize);
        setHistory(h => [...h, prize]);
        setTurnsUsed(t => t + 1);
        setSpinning(false);
      }
    }, 80);
  };

  const addItem = e => {
    e.preventDefault();
    const form = e.target;
    const newItem = {
      id: Date.now(),
      name: form.name.value,
      emoji: form.emoji.value,
      category: form.category.value
    };
    setItems(prev => [...prev, newItem]);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
        <Nav/>

      {view === "game" && (
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
            <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Slot de Bisutería</h1>
            <p className="text-sm text-gray-500 mb-4">
              {selectedPlan && selectedOption
                ? `Plan activo: ${selectedPlan.name} – ${selectedOption.turns} turnos / $${selectedOption.price}`
                : "Selecciona un plan para jugar"}
            </p>

            {/* PLAN SELECTOR */}
            {!selectedPlan && (
              <div className="mb-4 space-y-3">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full border rounded-xl p-3 text-left hover:bg-pink-100"
                  >
                    <strong>{plan.name}</strong>
                  </button>
                ))}
              </div>
            )}

            {/* OPTION SELECTOR */}
            {selectedPlan && !selectedOption && (
              <div className="mb-4 space-y-2">
                {selectedPlan.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedOption(opt);
                      setTurnsUsed(0);
                      setHistory([]);
                      setCurrent(null);
                    }}
                    className="w-full border rounded-xl p-3 text-sm hover:bg-pink-100"
                  >
                    {opt.turns} turnos — ${opt.price}
                  </button>
                ))}
              </div>
            )}

            {/* SLOT MACHINE DISPLAY */}
            <div className="w-40 h-40 mx-auto mb-4 rounded-2xl border-4 border-pink-300 flex flex-col items-center justify-center bg-pink-100">
              <div className={spinning ? "animate-spin" : ""}>
                <span className="text-5xl">{current?.emoji || "❔"}</span>
              </div>
              <p className="text-xs mt-2 text-gray-600">{current?.name || ""}</p>
            </div>

            <button
              onClick={spin}
              disabled={!selectedOption || spinning || turnsUsed >= turnsTotal}
              className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold disabled:opacity-40"
            >
              {spinning ? "Girando..." : "Girar 🎰"}
            </button>

            <div className="flex justify-between text-sm mt-4 text-gray-600">
              <span>Turnos: {turnsUsed}/{turnsTotal}</span>
              <span>Gastado: ${selectedOption ? selectedOption.price : 0}</span>
            </div>

            <div className="mt-4 text-left">
              <h3 className="font-semibold text-sm mb-2">🎁 Premios</h3>
              <ul className="space-y-1 text-sm">
                {history.map((p, i) => (
                  <li key={i} className="flex justify-between bg-pink-50 px-3 py-1 rounded-lg">
                    <span>{p.name}</span>
                    <span>{p.emoji}</span>
                  </li>
                ))}
                {!history.length && <li className="text-gray-400">Aún no hay premios</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN VIEW */}
      {view === "admin" && (
        <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-pink-600 mb-4">🧑‍💼 Panel Admin</h2>

          <form onSubmit={addItem} className="space-y-2 mb-4">
            <input name="name" placeholder="Nombre" className="w-full border rounded-xl px-3 py-2" required />
            <input name="emoji" placeholder="Emoji 🎀" className="w-full border rounded-xl px-3 py-2" required />
            <input name="category" placeholder="Categoría" className="w-full border rounded-xl px-3 py-2" required />
            <button className="w-full bg-pink-500 text-white py-2 rounded-xl">Agregar premio</button>
          </form>

          <ul className="space-y-2 text-sm">
            {items.map(item => (
              <li key={item.id} className="flex justify-between bg-pink-50 px-3 py-2 rounded-xl">
                <span>{item.emoji} {item.name}</span>
                <span className="text-xs text-gray-500">{item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

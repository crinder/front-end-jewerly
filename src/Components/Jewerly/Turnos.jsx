import React from 'react'

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

const Turnos = () => {
    return (
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
    )
}

export default Turnos
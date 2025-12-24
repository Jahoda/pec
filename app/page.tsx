"use client"

import { useState, useEffect, useCallback } from "react"

interface PecData {
  currentTemp: number
  targetTemp: number
  status: "off" | "heating" | "cooling" | "ready"
  power: number
  runningTime: number
  timestamp: string
}

interface HistoryEntry {
  temp: number
  time: string
}

const statusLabels = {
  off: "Vypnuto",
  heating: "Nahřívání",
  cooling: "Chlazení",
  ready: "Připraveno",
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export default function Home() {
  const [data, setData] = useState<PecData | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [targetInput, setTargetInput] = useState("850")

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/pec")
      const json = await res.json()
      setData(json)
      setHistory((prev) => {
        const entry = {
          temp: json.currentTemp,
          time: new Date().toLocaleTimeString("cs-CZ"),
        }
        return [entry, ...prev].slice(0, 5)
      })
    } catch (e) {
      console.error("Chyba při načítání dat:", e)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleAction = async (action: "start" | "stop") => {
    await fetch("/api/pec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        targetTemp: parseInt(targetInput) || 850,
      }),
    })
    fetchData()
  }

  if (!data) {
    return (
      <div className="container">
        <h1>🔥 Pec Monitor</h1>
        <div className="loading">Načítání...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>🔥 Pec Monitor</h1>

      <div className={`status ${data.status}`}>{statusLabels[data.status]}</div>

      <div className="dashboard">
        <div className="card">
          <h2>Aktuální teplota</h2>
          <div className="value temp">
            {data.currentTemp}
            <span className="unit">°C</span>
          </div>
        </div>

        <div className="card">
          <h2>Cílová teplota</h2>
          <div className="value target">
            {data.targetTemp}
            <span className="unit">°C</span>
          </div>
        </div>

        <div className="card">
          <h2>Výkon</h2>
          <div className="value power">
            {data.power}
            <span className="unit">%</span>
          </div>
        </div>

        <div className="card">
          <h2>Doba běhu</h2>
          <div className="value time">{formatTime(data.runningTime)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Ovládání</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem", flexWrap: "wrap" }}>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="Cílová teplota"
            min="100"
            max="1200"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #0f3460",
              background: "#1a1a2e",
              color: "#eee",
              width: "120px",
            }}
          />
          <button
            onClick={() => handleAction("start")}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              background: "#16a34a",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Start
          </button>
          <button
            onClick={() => handleAction("stop")}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Stop
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="history">
          <h2>Historie teplot</h2>
          <ul>
            {history.map((entry, i) => (
              <li key={i}>
                <span>{entry.temp}°C</span>
                <span className="time-stamp">{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer>
        Demo Next.js aplikace | Odpověď na diskuzi o &quot;kanónu na vrabce&quot;
      </footer>
    </div>
  )
}

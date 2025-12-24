// Server Component s Server Actions - minimální JS
import { startPec, stopPec, getPecData } from "./actions"

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

const buttonStyle = {
  padding: "0.5rem 1.5rem",
  borderRadius: "6px",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold" as const,
}

export default async function Home() {
  const data = await getPecData()

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
          <form action={startPec} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              name="targetTemp"
              defaultValue={data.targetTemp}
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
            <button type="submit" style={{ ...buttonStyle, background: "#16a34a" }}>
              Start
            </button>
          </form>
          <form action={stopPec}>
            <button type="submit" style={{ ...buttonStyle, background: "#dc2626" }}>
              Stop
            </button>
          </form>
        </div>
        <p style={{ textAlign: "center", marginTop: "0.75rem", color: "#888", fontSize: "0.85rem" }}>
          Stav: {data.isHeating ? "Topení zapnuto" : "Topení vypnuto"}
        </p>
      </div>

      <footer>
        Demo Next.js aplikace | Server Actions bez API calls
      </footer>
    </div>
  )
}

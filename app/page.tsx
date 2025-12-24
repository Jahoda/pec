// Server Component - žádný JS se neposílá klientovi pro tuto část
// Data se renderují na serveru, klient dostane hotové HTML

interface PecData {
  currentTemp: number
  targetTemp: number
  status: "off" | "heating" | "cooling" | "ready"
  power: number
  runningTime: number
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

// Simulovaná data - v reálné aplikaci by přišla z databáze nebo přímo z HW
function getPecData(): PecData {
  return {
    currentTemp: 847,
    targetTemp: 850,
    status: "ready",
    power: 12,
    runningTime: 3725,
  }
}

export default function Home() {
  const data = getPecData()

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
            defaultValue="850"
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

      <div className="history">
        <h2>Historie teplot</h2>
        <ul>
          <li><span>847°C</span><span className="time-stamp">14:32:05</span></li>
          <li><span>845°C</span><span className="time-stamp">14:32:03</span></li>
          <li><span>842°C</span><span className="time-stamp">14:32:01</span></li>
          <li><span>838°C</span><span className="time-stamp">14:31:59</span></li>
          <li><span>833°C</span><span className="time-stamp">14:31:57</span></li>
        </ul>
      </div>

      <footer>
        Demo Next.js aplikace | Odpověď na diskuzi o &quot;kanónu na vrabce&quot;
      </footer>
    </div>
  )
}

// API endpoint zůstává v /api/pec/route.ts pro případné budoucí použití
// ale tato stránka ho nepoužívá - vše se renderuje na serveru

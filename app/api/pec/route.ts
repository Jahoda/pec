import { NextResponse } from "next/server"

// Simulace dat z pece - v reálné aplikaci by to bylo z HW
let currentTemp = 25
let targetTemp = 850
let isHeating = false
let startTime: number | null = null

function simulateFurnace() {
  if (isHeating) {
    if (currentTemp < targetTemp) {
      currentTemp += Math.random() * 15 + 5
      if (currentTemp > targetTemp) currentTemp = targetTemp
    }
  } else {
    if (currentTemp > 25) {
      currentTemp -= Math.random() * 3 + 1
      if (currentTemp < 25) currentTemp = 25
    }
  }
}

export async function GET() {
  simulateFurnace()

  const now = Date.now()
  const runningTime = startTime ? Math.floor((now - startTime) / 1000) : 0

  let status: "off" | "heating" | "cooling" | "ready"
  if (!isHeating && currentTemp <= 30) {
    status = "off"
  } else if (isHeating && currentTemp < targetTemp) {
    status = "heating"
  } else if (currentTemp >= targetTemp - 5) {
    status = "ready"
  } else {
    status = "cooling"
  }

  const power = isHeating ? Math.round(((targetTemp - currentTemp) / targetTemp) * 100) : 0

  return NextResponse.json({
    currentTemp: Math.round(currentTemp),
    targetTemp,
    status,
    power: Math.max(0, Math.min(100, power)),
    runningTime,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (body.action === "start") {
    isHeating = true
    startTime = Date.now()
    if (body.targetTemp) {
      targetTemp = Math.min(1200, Math.max(100, body.targetTemp))
    }
  } else if (body.action === "stop") {
    isHeating = false
  }

  return NextResponse.json({ success: true, isHeating, targetTemp })
}

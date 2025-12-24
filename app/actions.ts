"use server"

import { revalidatePath } from "next/cache"

// Simulovaný stav pece - v reálné aplikaci by to byla databáze nebo HW API
// Tento stav přežívá mezi requesty (v rámci jednoho procesu)
const pecState = {
  isHeating: false,
  targetTemp: 850,
  currentTemp: 25,
  startTime: null as number | null,
}

function simulateFurnace() {
  if (pecState.isHeating) {
    if (pecState.currentTemp < pecState.targetTemp) {
      pecState.currentTemp += Math.random() * 15 + 5
      if (pecState.currentTemp > pecState.targetTemp) {
        pecState.currentTemp = pecState.targetTemp
      }
    }
  } else {
    if (pecState.currentTemp > 25) {
      pecState.currentTemp -= Math.random() * 3 + 1
      if (pecState.currentTemp < 25) pecState.currentTemp = 25
    }
  }
}

export async function startPec(formData: FormData) {
  const targetTemp = parseInt(formData.get("targetTemp") as string) || 850
  pecState.isHeating = true
  pecState.targetTemp = Math.min(1200, Math.max(100, targetTemp))
  pecState.startTime = Date.now()
  simulateFurnace()
  revalidatePath("/")
}

export async function stopPec() {
  pecState.isHeating = false
  simulateFurnace()
  revalidatePath("/")
}

export async function getPecData() {
  simulateFurnace()

  const now = Date.now()
  const runningTime = pecState.startTime ? Math.floor((now - pecState.startTime) / 1000) : 0

  let status: "off" | "heating" | "cooling" | "ready"
  if (!pecState.isHeating && pecState.currentTemp <= 30) {
    status = "off"
  } else if (pecState.isHeating && pecState.currentTemp < pecState.targetTemp) {
    status = "heating"
  } else if (pecState.currentTemp >= pecState.targetTemp - 5) {
    status = "ready"
  } else {
    status = "cooling"
  }

  const power = pecState.isHeating
    ? Math.round(((pecState.targetTemp - pecState.currentTemp) / pecState.targetTemp) * 100)
    : 0

  return {
    currentTemp: Math.round(pecState.currentTemp),
    targetTemp: pecState.targetTemp,
    status,
    power: Math.max(0, Math.min(100, power)),
    runningTime,
    isHeating: pecState.isHeating,
  }
}

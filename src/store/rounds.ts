import { create } from 'zustand'

export interface Round {
  id: string
  startAt: string // ISO string
  endAt: string   // ISO string
  status: string  // "Активен" | "Cooldown" | и т.д.
}

interface RoundsState {
  rounds: Round[]
  setRounds: (rounds: Round[]) => void
}

export const useRoundsStore = create<RoundsState>((set) => ({
  rounds: [],
  setRounds: (rounds) => set({ rounds }),
})) 
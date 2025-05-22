import { create } from 'zustand'

interface UserInfo {
  id: number
  username: string
  role: string
}

interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
})) 
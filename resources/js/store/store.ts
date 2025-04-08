import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session } from '@/types'

interface ProfileState {
    activeSession: Session[]
    userAgent: string
    setActiveSession: (sessions: Session[]) => void
    setUserAgent: (agent: string) => void
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            activeSession: [],
            userAgent: '',
            setActiveSession: (sessions) => set({ activeSession: sessions }),
            setUserAgent: (agent) => set({ userAgent: agent }),
        }),
        {
            name: 'profile-store',
        }
    )
)

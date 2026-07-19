import type { SessionLog, TrainingPlan, UserProfile, WeightLog } from "../types"

const BASE_URL = import.meta.env.VITE_API_URL

async function request(path: string, options?: RequestInit) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    if (!response.ok) {
        let message = 'Request failed'
        try {
            const body = await response.json()
            message = body.error || message
        } catch {
            // ignore, keep default message
        }
        throw new Error(message)
    }

    return response.json()
}

function post(path: string, body: object) {
    return request(path, { method: 'POST', body: JSON.stringify(body) })
}

function get(path: string) {
    return request(path)
}

export const api = {
    saveProfile: (
        userId: string,
        profileData: Omit<UserProfile, "userId" | "updatedAt">
    ): Promise<{ message: string }> => {
        return post('/api/profile', { userId, ...profileData })
    },
    getProfile: (userId: string): Promise<UserProfile> => {
        return get(`/api/profile/${userId}`)
    },
    generatePlan: (userId: string): Promise<TrainingPlan> => {
        return post('/api/plan/generate', { userId })
    },
    getPlan: (userId: string): Promise<TrainingPlan> => {
        return get(`/api/plan/current?userId=${userId}`)
    },
    logWeight: (userId: string, weight: number): Promise<WeightLog> => {
        return post('/api/progress/weight', { userId, weight })
    },
    getWeightHistory: (userId: string): Promise<WeightLog[]> => {
        return get(`/api/progress/weight/${userId}`)
    },
    completeSession: (userId: string, week: number, day: string): Promise<SessionLog> => {
        return post('/api/progress/session', { userId, week, day })
    },
    getSessions: (userId: string): Promise<SessionLog[]> => {
        return get(`/api/progress/sessions/${userId}`)
    },
}

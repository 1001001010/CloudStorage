import React, { useState, useEffect, FormEventHandler } from 'react'
import { Button } from '@/components/ui/button'
import type { Session } from '@/types'
import { useForm } from '@inertiajs/react'

export default function ActiveSession({
    activeSessions,
    userAgent,
}: {
    activeSessions: Session[]
    userAgent: string
}) {
    const {
        delete: destroy,
        processing,
        setData,
    } = useForm({
        payload: '',
    })

    const handleDestroySession: FormEventHandler = (e) => {
        e.preventDefault()
        destroy(route('session.destroy'))
    }

    return (
        <div>
            <ul>
                {activeSessions.map((session, index) => (
                    <form
                        onSubmit={handleDestroySession}
                        key={index}
                        id={`form-${index}`}>
                        <li className="mb-4 w-full rounded-lg border p-4 shadow">
                            {userAgent == session.user_agent ? (
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                                    </span>
                                    <p className="font-semibold">
                                        Текущая сессия
                                    </p>
                                </div>
                            ) : null}
                            <p>IP адрес: {session.ip_address}</p>
                            <p>
                                Последняя активность:{' '}
                                {new Date(
                                    session.last_activity * 1000
                                ).toLocaleString()}
                            </p>
                            <Button
                                id={`button-${index}`}
                                type="submit"
                                variant="outline"
                                className="mt-2"
                                disabled={processing}
                                onClick={() =>
                                    setData('payload', session.payload)
                                }>
                                Завершить
                            </Button>
                        </li>
                    </form>
                ))}
            </ul>
        </div>
    )
}

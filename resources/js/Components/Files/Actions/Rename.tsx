import { useState, useRef, useEffect } from 'react'
import { Input } from '@/Components/ui/input'
import { useForm } from '@inertiajs/react'

interface RenameProps {
    fileId: number
    initialName: string
    onCancel: () => void
    onRename: () => void
}

export default function FileRename({
    fileId,
    initialName,
    onCancel,
    onRename,
}: RenameProps) {
    const { setData, patch, processing, reset } = useForm({
        name: initialName,
    })
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        patch(route('file.rename', { file: fileId }), {
            onSuccess: () => {
                reset()
                onRename()
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <Input
                type="text"
                defaultValue={initialName}
                ref={inputRef}
                onChange={(e) => setData('name', e.target.value)}
                className="rounded border border-gray-300 p-3"
            />
        </form>
    )
}

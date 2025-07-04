'use client'

import type { File as FileType } from '@/types'
import { Dialog, DialogTrigger, DialogContent } from '@/Components/ui/dialog'
import { Info } from 'lucide-react'
import UserAccessList from './UserAccessList'
import { formatDate } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import { useState, useEffect } from 'react'

const formatFileSize = (bytes: number) => {
    const kb = 1024 // 1KB = 1024 байт
    const mb = 1024 * 1024 // 1MB = 1024 * 1024 байт
    const gb = 1024 * 1024 * 1024 // 1GB = 1024 * 1024 * 1024 байт

    if (bytes >= gb) {
        return `${(bytes / gb).toFixed(2)} ГБ`
    } else if (bytes >= mb) {
        return `${(bytes / mb).toFixed(2)} МБ`
    } else if (bytes >= kb) {
        return `${(bytes / kb).toFixed(2)} КБ`
    } else {
        return `${bytes} Б`
    }
}

export default function FileInfo({
    file: initialFile,
    role,
    variant,
}: {
    file: FileType
    role: 'Sender' | 'Receiver'
    variant: 'context' | 'button'
}) {
    const [open, setIsOpen] = useState(false)
    const [file, setFile] = useState<FileType>(initialFile)
    const [loading, setLoading] = useState(false)

    const updateFileInfo = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/file/${file.id}`)
            if (response.ok) {
                const data = await response.json()

                // Проверяем структуру ответа
                if (data.success && data.file) {
                    setFile(data.file)
                } else {
                    console.error('Неожиданная структура ответа:', data)
                }
            } else {
                console.error('Ошибка HTTP:', response.status)
            }
        } catch (error) {
            console.error('Ошибка при обновлении информации о файле:', error)
        } finally {
            setLoading(false)
        }
    }

    // Обновляем информацию при открытии диалога
    useEffect(() => {
        if (open) {
            updateFileInfo()
        }
    }, [open])

    const Content = (
        <>
            <Info className="mr-2 h-4 w-4" />
            Информация
        </>
    )

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            {variant === 'button' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}>
                    {Content}
                </Button>
            ) : (
                <DialogTrigger
                    onClick={() => setIsOpen(true)}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    {Content}
                </DialogTrigger>
            )}

            {role === 'Receiver' || role === 'Sender' ? (
                <DialogContent className="">
                    {loading ? (
                        <div className="flex items-center justify-center p-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <h3>
                                Свойства{' '}
                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    {file.name}.
                                    {file.extension?.extension || 'unknown'}
                                </code>
                            </h3>
                            <div>
                                <p>
                                    <span className="font-bold">
                                        Название:{' '}
                                    </span>
                                    {file.name}
                                </p>
                                <p>
                                    <span className="font-bold">
                                        Расширение:{' '}
                                    </span>
                                    .{file.extension?.extension || 'unknown'}
                                </p>
                                <p>
                                    <span className="font-bold">Вес: </span>
                                    {formatFileSize(file.size)}
                                </p>
                                <p>
                                    <span className="font-bold">
                                        Дата загрузки:{' '}
                                    </span>
                                    {formatDate(file.created_at)}
                                </p>
                            </div>
                            {role === 'Receiver' ? (
                                <div>
                                    <p>
                                        <span className="font-bold">
                                            Отправитель:{' '}
                                        </span>
                                        {file.user?.name || 'Неизвестно'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {file.access_tokens &&
                                    file.access_tokens.length > 0 ? (
                                        <div>
                                            <h4 className="font-bold">
                                                Список токенов доступа:
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2 pt-2">
                                                {file.access_tokens
                                                    .slice(0, 5)
                                                    .map((token, index) => (
                                                        <UserAccessList
                                                            token={token}
                                                            key={index}
                                                            onUpdate={
                                                                updateFileInfo
                                                            }
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Токенов доступа нет
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </DialogContent>
            ) : null}
        </Dialog>
    )
}

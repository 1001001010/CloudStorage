'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/Components/ui/dialog'
import { Skeleton } from '@/Components/ui/skeleton'
import { Button } from '@/Components/ui/button'
import { VideotapeIcon, X } from 'lucide-react'
import ReactPlayer from 'react-player'
import type { File as FileType } from '@/types'
import FileDownload from './Download'
import FileShare from './Share'
import FileInfo from './Shared/Info'
import FileRename from './Rename'
import FileDelete from './Delete'

export default function FileVideoView({
    file,
    accessLink,
}: {
    file: FileType
    accessLink?: string
}) {
    const [videoUrl, setVideoUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        axios
            .get(`/api/file-url/${file.id}`)
            .then((response) => {
                setVideoUrl(response.data.fileUrl)
            })
            .catch(() => {
                toast('Ошибка загрузки видео')
            })
            .finally(() => {
                setLoading(false)
            })

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsFullscreen((prev) => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [file.id])

    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground">
                <VideotapeIcon className="mr-2 h-4 w-4" />
                Воспроизвести
            </DialogTrigger>
            <DialogContent
                className={`${isFullscreen ? 'h-[90vh] max-w-[95vw]' : 'max-w-4xl'}`}>
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-1">
                        <span>Просмотр видео</span>
                        <code className="relative max-w-xs truncate rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name}.{file.extension.extension}
                        </code>
                    </DialogTitle>
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Закрыть</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                    <div className="relative w-full overflow-hidden rounded-lg bg-muted/20">
                        {loading ? (
                            <Skeleton className="h-[400px] w-full rounded-lg" />
                        ) : (
                            <div
                                className={`mx-auto w-full transition-all duration-300 ${isFullscreen ? 'max-h-[70vh]' : 'max-h-[400px]'}`}>
                                <ReactPlayer
                                    url={videoUrl}
                                    controls
                                    width="100%"
                                    height={isFullscreen ? '70vh' : '400px'}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <FileDownload file={file} variant="button" />
                            <FileShare
                                file={file}
                                accessLink={accessLink}
                                variant="button"
                            />
                            {file.access_tokens ? (
                                <FileInfo
                                    file={file}
                                    role="Sender"
                                    variant="button"
                                />
                            ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <FileRename file={file} variant="button" />
                            <FileDelete file={file} variant="button" />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

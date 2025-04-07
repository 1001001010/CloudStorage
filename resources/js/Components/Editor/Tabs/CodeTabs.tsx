'use client'

import type { File, PageProps } from '@/types'
import { useEffect, useState, useRef } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { ChevronLeft, RotateCcw, Save } from 'lucide-react'
import { Editor } from '@monaco-editor/react'

export default function CodeTabs({
    file,
    language,
}: PageProps<{ file: File; language: string }>) {
    const { setData, post } = useForm({
        fileText: file.content || '',
    })

    const [isDarkMode] = useState(() =>
        typeof window !== 'undefined'
            ? localStorage.getItem('theme') === 'dark'
            : false
    )

    const [content, setContent] = useState(file.content)
    const editorContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setContent(file.content)
    }, [file.content])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    const restoreText = () => {
        setContent(file.content)
        setData('fileText', file.content ?? '')
    }

    const saveText = () => {
        post(route('file.edit.upload', { file: file.id }))
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
            <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <Link href={route('index')}>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Назад</span>
                        </Button>
                    </Link>
                    <h2 className="text-lg font-semibold">
                        Редактирование{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name + '.' + file.extension.extension}
                        </code>
                    </h2>
                </div>
            </div>

            <div
                ref={editorContainerRef}
                className="w-full flex-1 overflow-hidden">
                <Editor
                    width="100%"
                    height="100%"
                    language={language}
                    value={content ?? ''}
                    onChange={(value: any) => {
                        setContent(value || '')
                        setData('fileText', value || '')
                    }}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    options={{
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        wordWrap: 'on',
                        wrappingStrategy: 'advanced',
                    }}
                    onMount={(editor) => {
                        setTimeout(() => {
                            editor.layout()
                        }, 100)
                    }}
                />
            </div>

            <div className="flex items-center justify-between border-t bg-background p-4">
                <div className="flex space-x-2">
                    <Button onClick={saveText} className="gap-1">
                        <Save size={18} />
                        <span>Сохранить</span>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={restoreText}
                        className="gap-1">
                        <RotateCcw size={18} />
                        <span>Сбросить</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

import { File, PageProps } from '@/types'
import { useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { RotateCcw } from 'lucide-react'
import { Editor } from '@monaco-editor/react'

export default function CodeTabs({
    file,
    language,
}: PageProps<{ file: File; language: string }>) {
    const { setData, post } = useForm({
        fileText: file.content || '',
    })

    const [content, setContent] = useState(file.content)

    useEffect(() => {
        setContent(file.content)
    }, [file.content])

    const restoreText = () => {
        setContent(file.content)
        setData('fileText', file.content ?? '')
    }

    const saveText = () => {
        post(route('file.edit.upload', { file: file.id }))
    }

    return (
        <div className="flex h-screen w-full flex-col gap-3">
            <div className="flex-1">
                <Editor
                    width="100%"
                    language={language}
                    value={content ?? ''}
                    onChange={(value: any) => setContent(value || '')}
                    theme="vs-dark"
                    options={{
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false },
                        automaticLayout: true,
                    }}
                />
            </div>
            <div className="flex space-x-2">
                <Button onClick={saveText}>Сохранить</Button>
                <Button variant="secondary" onClick={restoreText}>
                    <RotateCcw />
                    <span className="ml-2">Сбросить</span>
                </Button>
            </div>
        </div>
    )
}

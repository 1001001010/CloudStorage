import { File, PageProps } from '@/types'
import { useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Textarea } from '@/Components/ui/textarea'
import { Button } from '@/Components/ui/button'
import { RotateCcw } from 'lucide-react'
import { CodeViewer } from '../components/code-viewer'
import { TabsContent } from '@/Components/ui/tabs'

export default function CodeTabs({
    file,
    language,
}: PageProps<{ file: File; language: string }>) {
    const { data, setData, post, reset } = useForm({
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()

            const textarea = e.currentTarget
            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (content !== null) {
                const newText =
                    content.slice(0, start) + '    ' + content.slice(end)

                setContent(newText)
                setData('fileText', newText)
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 4
                }, 0)
            }
        }
    }

    return (
        <TabsContent value="insert" className="mt-0 border-0 p-0">
            <div className="flex flex-col space-y-4">
                <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                    <Textarea
                        placeholder="Содержимое документа"
                        value={content ?? ''}
                        onChange={(e) => {
                            const newText = e.target.value
                            setContent(newText)
                            setData('fileText', newText)
                        }}
                        onKeyDown={handleKeyDown}
                        className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
                    />
                    <div className="rounded-md border bg-muted">
                        <CodeViewer code={content ?? ''} language={language} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={saveText}>Сохранить</Button>
                    <Button variant="secondary" onClick={restoreText}>
                        <span className="sr-only">Сбросить</span>
                        <RotateCcw />
                    </Button>
                </div>
            </div>
        </TabsContent>
    )
}

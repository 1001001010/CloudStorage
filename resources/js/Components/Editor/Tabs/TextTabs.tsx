import { File, PageProps } from '@/types'
import { Textarea } from '@/Components/ui/textarea'
import { Button } from '@/Components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@inertiajs/react'

export default function TextTabs({ file }: PageProps<{ file: File }>) {
    const { data, setData, post, errors, processing, reset } = useForm({
        fileText: file.content || '',
    })

    const [initialContent, setInitialContent] = useState(file.content)
    const [content, setContent] = useState(file.content)

    const restoreText = () => {
        setContent(file.content)
        setData('fileText', file.content ?? '')
    }

    const saveText = () => {
        setData('fileText', content ?? '')
        post(route('file.edit.upload', { file: file.id }))
    }

    return (
        <>
            <div className="flex h-full flex-col space-y-4">
                <Textarea
                    placeholder="Содержимое документа"
                    value={data.fileText}
                    onChange={(e) => setData('fileText', e.target.value)}
                    className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
                />

                <div className="flex items-center space-x-2">
                    <Button onClick={saveText}>Сохранить</Button>
                    <Button variant="secondary" onClick={restoreText}>
                        <span className="sr-only">Сбросить</span>
                        <RotateCcw />
                    </Button>
                </div>
            </div>
        </>
    )
}

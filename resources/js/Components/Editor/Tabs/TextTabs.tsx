import { File, PageProps } from '@/types'
import { Textarea } from '@/Components/ui/textarea'
import { Button } from '@/Components/ui/button'
import { ChevronLeft, RotateCcw, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useForm } from '@inertiajs/react'

export default function TextTabs({ file }: PageProps<{ file: File }>) {
    const { data, setData, post, errors, processing, reset } = useForm({
        fileText: file.content || '',
    })

    const [content, setContent] = useState(file.content)

    const restoreText = () => {
        setContent(file.content)
        setData('fileText', file.content ?? '')
    }

    const saveText = () => {
        setData('fileText', content ?? '')
        post(route('file.edit.upload', { file: file.id }))
    }

    useEffect(() => {
        setContent(file.content)
        setData('fileText', file.content ?? '')
    }, [file.content])

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
            <div className="w-full flex-1 overflow-hidden">
                <Textarea
                    placeholder="Содержимое документа"
                    value={data.fileText}
                    onChange={(e) => setData('fileText', e.target.value)}
                    className="h-full w-full flex-1 p-4"
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

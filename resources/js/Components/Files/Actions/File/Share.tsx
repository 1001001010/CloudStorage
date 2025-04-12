import { File as FileType } from '@/types'
import { Share2 } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import { Slider } from '@/Components/ui/slider'
import { FormEventHandler, useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { useForm } from '@inertiajs/react'
import AccessFileLink from '../../AccessFileLink'

export default function FileShare({
    file,
    accessLink,
    variant,
}: {
    file: FileType
    accessLink?: string
    variant: 'context' | 'button'
}) {
    const [val, setVal] = useState(1)
    const [open, setIsOpen] = useState(false)
    const [openLink, setIsOpenLink] = useState(false)
    const { post, reset, errors, processing, setData } = useForm({
        file_id: file.id,
        user_limit: val,
    })

    useEffect(() => {
        setData('user_limit', val)
    }, [val])

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('access.upload'), {
            onSuccess: () => {
                setIsOpen(false)
                setIsOpenLink(true)
            },
        })
    }

    const getPeopleText = (count: number) => {
        const lastDigit = count % 10
        const lastTwoDigits = count % 100

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${count} пользователей`
        }

        if (lastDigit === 1) {
            return `${count} пользователь`
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return `${count} пользователя`
        } else {
            return `${count} пользователей`
        }
    }

    const Content = (
        <>
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
        </>
    )

    return (
        <>
            <Dialog open={open} onOpenChange={setIsOpen}>
                {variant === 'button' ? (
                    <Button
                        onClick={() => setIsOpen(true)}
                        variant="outline"
                        size="sm">
                        {Content}
                    </Button>
                ) : (
                    <DialogTrigger
                        onClick={() => setIsOpen(true)}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        {Content}
                    </DialogTrigger>
                )}

                <DialogContent className="min-w-fit">
                    <DialogHeader className="h-min">
                        <DialogTitle>
                            Поделиться файлом{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {file.name}.{file.extension.extension}
                            </code>
                        </DialogTitle>
                        <DialogDescription>
                            Выберите кол-во человек, которые получат доступ к
                            файлу
                            <span className="block">
                                После будет сгенерированная ссылка
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <p className="text-center">
                            Файл получат: {getPeopleText(val)}
                        </p>
                        <Slider
                            defaultValue={[val]}
                            max={50}
                            min={1}
                            step={1}
                            onValueChange={(i) => setVal(i[0])}
                        />
                        <Button type="submit" disabled={processing}>
                            Поделиться
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <AccessFileLink
                file={file}
                accessLink={accessLink}
                openLink={openLink}
                setIsOpenLink={setIsOpenLink}
            />
        </>
    )
}

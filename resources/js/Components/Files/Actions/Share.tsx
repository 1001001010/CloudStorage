import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Share2 } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Slider } from '@/Components/ui/slider'
import { FormEventHandler, useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'

export default function FileShare({ file }: { file: FileType }) {
    // console.log(link)
    const [val, setVal] = useState(1)
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
            // onSuccess: () => {
            //     toast('Ссылка успешно создана: ', { description: link })
            // },
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

    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Share2 className="mr-2 h-4 w-4" />
                Поделиться
            </DialogTrigger>
            <DialogContent className="min-w-fit">
                <DialogHeader className="h-min">
                    <DialogTitle>
                        Поделиться файлом {file.name}.{file.extension.extension}
                    </DialogTitle>
                    <DialogDescription>
                        Выберите кол-во человек, которые получат доступ к файлу
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
    )
}

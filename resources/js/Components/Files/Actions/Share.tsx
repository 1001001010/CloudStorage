import { File as FileType } from '@/types'
import { CalendarIcon, Share2 } from 'lucide-react'
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
import AccessFileLink from '@/Components/Files/AccessFileLink'

import * as React from 'react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover'
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area'
import { Calendar } from '@/Components/ui/calendar'

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
    const [date, setDate] = React.useState<Date>()
    const [openLink, setIsOpenLink] = useState(false)

    const { post, reset, errors, processing, setData } = useForm({
        file_id: file.id,
        user_limit: val,
        expires_at: null as string | null,
    })

    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

    const hours = Array.from({ length: 24 }, (_, i) => i)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const withTime = new Date(selectedDate)
            if (date) {
                withTime.setHours(date.getHours())
                withTime.setMinutes(date.getMinutes())
            }
            setDate(withTime)
        }
    }

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (date) {
            const newDate = new Date(date)
            if (type === 'hour') {
                newDate.setHours(parseInt(value))
            } else if (type === 'minute') {
                newDate.setMinutes(parseInt(value))
            }
            setDate(newDate)
        }
    }

    useEffect(() => {
        setData('user_limit', val)
    }, [val])

    useEffect(() => {
        if (date) {
            setData('expires_at', format(date, 'yyyy-MM-dd HH:mm:ss'))
        } else {
            setData('expires_at', null)
        }
    }, [date])

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
                        <p className="text-center">Срок действия ссылки до:</p>
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !date && 'text-muted-foreground'
                                    )}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? (
                                        format(date, 'dd.MM.yyyy HH:mm')
                                    ) : (
                                        <span>ДД.ММ.ГГГГ чч:мм</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <div className="sm:flex">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                    />
                                    <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex p-2 sm:flex-col">
                                                {hours.map((hour) => (
                                                    <Button
                                                        key={hour}
                                                        size="icon"
                                                        variant={
                                                            date &&
                                                            date.getHours() ===
                                                                hour
                                                                ? 'default'
                                                                : 'ghost'
                                                        }
                                                        className="aspect-square shrink-0 sm:w-full"
                                                        onClick={() =>
                                                            handleTimeChange(
                                                                'hour',
                                                                hour.toString()
                                                            )
                                                        }>
                                                        {hour}
                                                    </Button>
                                                ))}
                                            </div>
                                            <ScrollBar
                                                orientation="horizontal"
                                                className="sm:hidden"
                                            />
                                        </ScrollArea>
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex p-2 sm:flex-col">
                                                {Array.from(
                                                    { length: 12 },
                                                    (_, i) => i * 5
                                                ).map((minute) => (
                                                    <Button
                                                        key={minute}
                                                        size="icon"
                                                        variant={
                                                            date &&
                                                            date.getMinutes() ===
                                                                minute
                                                                ? 'default'
                                                                : 'ghost'
                                                        }
                                                        className="aspect-square shrink-0 sm:w-full"
                                                        onClick={() =>
                                                            handleTimeChange(
                                                                'minute',
                                                                minute.toString()
                                                            )
                                                        }>
                                                        {minute
                                                            .toString()
                                                            .padStart(2, '0')}
                                                    </Button>
                                                ))}
                                            </div>
                                            <ScrollBar
                                                orientation="horizontal"
                                                className="sm:hidden"
                                            />
                                        </ScrollArea>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
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

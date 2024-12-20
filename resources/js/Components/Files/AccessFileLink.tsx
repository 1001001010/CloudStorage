import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Copy, Share2 } from 'lucide-react'
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
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { toast } from 'sonner'

export default function AccessFileLink({
    file,
    accessLink,
    openLink,
}: {
    file: FileType
    accessLink?: string
    openLink: boolean
}) {
    const handleCopy = () => {
        const textToCopy: string = accessLink ?? ''
        navigator.clipboard.writeText(textToCopy)
        toast('Ссылка успешно скопирована')
    }

    return (
        <Dialog open={openLink}>
            <DialogContent className="min-w-fit">
                <DialogHeader className="h-min">
                    <DialogTitle>
                        Поделиться файлом {file.name}.{file.extension.extension}
                    </DialogTitle>
                    <DialogDescription>Ссылка на файл:</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 pt-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={accessLink}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="px-3"
                        onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        <Copy />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        // <AccessFileLink />
    )
}

// <Popover>
//     <PopoverTrigger asChild>
//         <Button variant="secondary">Share</Button>
//     </PopoverTrigger>
//     <PopoverContent align="end" className="w-[520px]">
//         <div className="flex flex-col space-y-2 text-center sm:text-left">
//             <h3 className="text-lg font-semibold">Share preset</h3>
//             <p className="text-sm text-muted-foreground">
//                 Anyone who has this link and an OpenAI account will be able to
//                 view this.
//             </p>
//         </div>
//     </PopoverContent>
// </Popover>

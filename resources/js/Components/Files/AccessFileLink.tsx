import { File as FileType } from '@/types'
import { Copy } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { toast } from 'sonner'

export default function AccessFileLink({
    file,
    accessLink,
    openLink,
    setIsOpenLink,
}: {
    file: FileType
    accessLink?: string
    openLink: boolean
    setIsOpenLink: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const handleCopy = () => {
        const textToCopy: string = accessLink ?? ''
        navigator.clipboard.writeText(textToCopy)
        toast('Ссылка успешно скопирована')
    }

    return (
        <Dialog open={openLink} onOpenChange={setIsOpenLink}>
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
                        <span className="sr-only">Скопировать</span>
                        <Copy />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

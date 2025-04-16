import { Button } from '@/Components/ui/button'
import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Download } from 'lucide-react'

export default function FileDownload({
    file,
    variant,
}: {
    file: FileType
    variant: 'context' | 'button'
}) {
    const Content = (
        <>
            <Download className="mr-2 h-4 w-4" />
            Скачать
        </>
    )
    return (
        <a href={route('file.download', { file: file.id })}>
            {variant === 'button' ? (
                <Button variant="outline" size="sm">
                    {Content}
                </Button>
            ) : (
                <ContextMenuItem>{Content}</ContextMenuItem>
            )}
        </a>
    )
}

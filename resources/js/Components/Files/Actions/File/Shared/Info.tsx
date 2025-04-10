import { File as FileType } from '@/types'
import { Dialog, DialogTrigger, DialogContent } from '@/Components/ui/dialog'
import { Info } from 'lucide-react'
import UserAccessList from './UserAccessList'
import { formatDate } from '@/lib/utils'

const formatFileSize = (bytes: number) => {
    const kb = 1024 // 1KB = 1024 байт
    const mb = 1024 * 1024 // 1MB = 1024 * 1024 байт
    const gb = 1024 * 1024 * 1024 // 1GB = 1024 * 1024 * 1024 байт

    if (bytes >= gb) {
        return `${(bytes / gb).toFixed(2)} ГБ`
    } else if (bytes >= mb) {
        return `${(bytes / mb).toFixed(2)} МБ`
    } else if (bytes >= kb) {
        return `${(bytes / kb).toFixed(2)} КБ`
    } else {
        return `${bytes} Б`
    }
}

export default function FileInfo({
    file,
    role,
}: {
    file: FileType
    role: 'Sender' | 'Receiver'
}) {
    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Info className="mr-2 h-4 w-4" />
                Информация
            </DialogTrigger>

            {role === 'Receiver' || role === 'Sender' ? (
                <DialogContent className="">
                    <h3>
                        Свойства{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name}.{file.extension.extension}
                        </code>
                    </h3>
                    <div>
                        <p>
                            <span className="font-bold">Название: </span>
                            {file.name}
                        </p>
                        <p>
                            <span className="font-bold">Расширение: </span>.
                            {file.extension.extension}
                        </p>
                        <p>
                            <span className="font-bold">Вес: </span>
                            {formatFileSize(file.size)}
                        </p>
                        <p>
                            <span className="font-bold">Дата загрузки: </span>
                            {formatDate(file.created_at)}
                        </p>
                    </div>
                    {role === 'Receiver' ? (
                        <div>
                            <p>
                                <span className="font-bold">Отправитель: </span>
                                {file.user.name}
                            </p>
                        </div>
                    ) : (
                        <>
                            {file.access_tokens.length > 0 ? (
                                <div>
                                    <h4 className="font-bold">
                                        Список токенов доступа:
                                    </h4>
                                    <div className="flex justify-between gap-2 pt-2">
                                        {file.access_tokens
                                            .slice(0, 5)
                                            .map((token, index) => (
                                                <UserAccessList
                                                    token={token}
                                                    key={index}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </DialogContent>
            ) : null}
        </Dialog>
    )
}

import { useState } from 'react'
import { FileAccessToken, File as FileType } from '@/types'
import { Dialog, DialogTrigger, DialogContent } from '@/Components/ui/dialog'
import { Info } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import UserAccessList from './UserAccessList'

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
                        Свойства {file.name}.{file.extension.extension}
                    </h3>
                    <div>
                        <p>
                            <span className="font-bold">Название: </span>
                            {file.name}
                        </p>
                        <p>
                            <span className="font-bold">Расширение: </span>
                            {file.extension.extension}
                        </p>
                        <p>
                            <span className="font-bold">Вес: </span>
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                    {role === 'Receiver' && (
                        <div>
                            <p>
                                <span className="font-bold">Отправитель: </span>
                                {file.user.name}
                            </p>
                        </div>
                    )}

                    <div>
                        <h4 className="font-bold">Список токенов доступа:</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {file.access_tokens.slice(0, 5).map((token) => (
                                <UserAccessList token={token} />
                                // <Button
                                //     variant={'outline'}
                                //     key={token.id}
                                //     onClick={() => handleTokenClick(token)}>
                                //     <span>
                                //         {token.access_token.substring(0, 10)}...
                                //     </span>
                                // </Button>
                            ))}
                        </div>
                    </div>

                    {/* {selectedToken && (
                        <div>
                            <h5>Информация о токене:</h5>
                            <p>
                                <strong>Токен:</strong>{' '}
                                {selectedToken.access_token}
                            </p>
                            <p>
                                <strong>Лимит пользователей:</strong>{' '}
                                {selectedToken.user_limit}
                            </p>
                            <div>
                                <h6>Пользователи с доступом:</h6>
                                <ul>
                                    {Array.isArray(
                                        selectedToken.users_with_access
                                    ) &&
                                    selectedToken.users_with_access.length >
                                        0 ? (
                                        selectedToken.users_with_access.map(
                                            (userAccess, index) => (
                                                <li key={index}>
                                                    {userAccess.user.name}
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li>Нет пользователей с доступом</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )} */}
                </DialogContent>
            ) : null}
        </Dialog>
    )
}

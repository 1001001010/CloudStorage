import { Folder, PageProps } from '@/types'
import { useState } from 'react'

export default function MainFiles({
    auth,
    FoldersTree,
}: {
    auth: PageProps['auth']
    FoldersTree: Folder[]
}) {
    const [drag, setDrag] = useState(false)

    function dragStartHandler(e: any) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(e: any) {
        e.preventDefault()
        setDrag(false)
    }

    function onDrophandler(e: any) {
        e.preventDefault()
        let files = [...e.dataTransfer.files]
        console.log(files)

        setDrag(false)
    }
    return (
        <>
            {drag ? (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border-2 border-dashed shadow">
                    <div
                        className="h-full w-full"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                        onDrop={(e) => onDrophandler(e)}>
                        <div className="flex w-full flex-col gap-2 pt-5 text-center">
                            <p className="text-xl">Перетащите файлы</p>
                            <p className="text-lg text-white/80">
                                максимальный размер файла - 2ГБ
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                    <div
                        className="h-full w-full"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}></div>
                </div>
            )}
        </>
    )
}

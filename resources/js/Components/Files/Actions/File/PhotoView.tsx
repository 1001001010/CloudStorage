import { useState, useRef, useEffect } from 'react'
import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { LucideMousePointerSquareDashed } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'

export default function FilePhotoView({ file }: { file: FileType }) {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const imgRef = useRef<HTMLImageElement | null>(null)
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    })

    // Update image dimensions when file changes
    useEffect(() => {
        const img = imgRef.current
        if (img) {
            setImageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            })
        }
    }, [file])

    // Handle zooming with mouse wheel
    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 3))
    }

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 1))
    }

    const handleWheel = (event: React.WheelEvent) => {
        if (event.deltaY < 0) {
            zoomIn()
        } else {
            zoomOut()
        }
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault() // Prevent default drag behavior
        const startX = event.clientX
        const startY = event.clientY
        const startPosX = position.x
        const startPosY = position.y

        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault() // Prevent default drag behavior
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY
            setPosition({
                x: startPosX + deltaX,
                y: startPosY + deltaY,
            })
        }

        const handleMouseUp = () => {
            // Stop moving when mouse is released
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        // Add listeners to handle mouse movement
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <LucideMousePointerSquareDashed className="mr-2 h-4 w-4" />
                Просмотреть
            </DialogTrigger>

            <DialogContent className="h-[80%] w-[80%]">
                <DialogHeader className="h-min">
                    <DialogTitle>Просмотр изображения</DialogTitle>
                    <DialogDescription>
                        Вы можете увеличивать и уменьшать изображение с помощью
                        колесика мыши, а также передвигать его.
                    </DialogDescription>
                </DialogHeader>
                <div
                    className="relative flex h-full w-full items-center justify-center overflow-hidden"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}>
                    <img
                        ref={imgRef}
                        src={`/storage/${file.path}`}
                        alt={file.name}
                        className="transition-transform duration-300 ease-out" // Плавная анимация
                        style={{
                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            maxWidth:
                                imageDimensions.width < 1200 ? '100%' : 'auto',
                            maxHeight:
                                imageDimensions.height < 800 ? '100%' : 'auto',
                            objectFit:
                                imageDimensions.width < 1200
                                    ? 'cover'
                                    : 'contain',
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

// import { useState, useRef, useEffect } from 'react'
// import {
//     ContextMenu,
//     ContextMenuContent,
//     ContextMenuItem,
//     ContextMenuTrigger,
// } from '@/Components/ui/context-menu'
// import { File as FileType } from '@/types'
// import { Edit } from 'lucide-react'
// import { Button } from '@/Components/ui/button'
// import { Input } from '@/Components/ui/input'
// import { useForm } from '@inertiajs/react'

// export default function FileContext({ file }: { file: FileType }) {
//     const { data, setData, patch, errors, processing, reset } = useForm({
//         name: '',
//     })

//     const [isEditing, setIsEditing] = useState(false)
//     const inputRef = useRef<HTMLInputElement>(null)

//     useEffect(() => {
//         if (isEditing && inputRef.current) {
//             inputRef.current.focus()
//         }
//     }, [isEditing])

//     const handleEditClick = () => {
//         setIsEditing(true)
//     }

//     return (
//         <ContextMenuItem onClick={handleEditClick}>
//             <Edit className="mr-2 h-4 w-4" />
//             Переименовать
//         </ContextMenuItem>
//     )
// }

export const useDragHandlers = (
    currentFolderId: number,
    setData: (data: any) => void,
    setFileExtension: (ext: string) => void,
    setDrag: (drag: boolean) => void
) => {
    const dragStartHandler = (e: any) => {
        e.preventDefault()
        setDrag(true)
    }

    const dragLeaveHandler = (e: any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDrag(false)
        }
    }

    const onDrophandler = (e: any) => {
        e.preventDefault()
        const files = [...e.dataTransfer.files]
        setData({
            folder_id: currentFolderId !== 0 ? currentFolderId : null,
            files: files,
            file_name: null,
        })
        const fileName = files[0].name
        const fileExt = fileName.slice(fileName.lastIndexOf('.') + 1)
        setFileExtension(fileExt)
        setDrag(false)
    }

    return {
        dragStartHandler,
        dragLeaveHandler,
        onDrophandler,
    }
}

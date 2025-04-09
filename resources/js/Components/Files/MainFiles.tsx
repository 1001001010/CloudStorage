import { useState, useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'
import FoldersAndFiles from '@/Components/Files/MainFilesComponents/FoldersAndFiles'
import BreadcrumbFile from '@/Components/Files/MainFilesComponents/BreadcrumbFile'
import SearchFileInput from '@/Components/Files/MainFilesComponents/SearchFileInput'
import ViewControls from '@/Components/Files/MainFilesComponents/FoldersAndFiles/ViewControls'
import FilterControls from '@/Components/Files/MainFilesComponents/FoldersAndFiles/FilterControls'
import { useSettingsStore } from '@/store/settings-store'
import { useDragHandlers } from '@/hooks/use-drag-handlers'
import { Upload } from 'lucide-react'

type BreadcrumbItem = {
    title: string
    folderId: number
}

export default function MainFiles({
    FoldersFilesTree,
    accessLink,
}: {
    FoldersFilesTree: any[]
    accessLink?: string
}) {
    const { data, setData, post, processing } = useForm({
        folder_id: null as number | null,
        files: null as File[] | null,
        file_name: null as string | null,
    })

    const {
        viewMode,
        setViewMode,
        itemSize,
        setItemSize,
        filterType,
        setFilterType,
        sortDirection,
        setSortDirection,
    } = useSettingsStore()

    const [fileExtension, setFileExtension] = useState<string | null>(null)
    const [currentPath, setCurrentPath] = useState<any[]>([FoldersFilesTree])
    const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
        { title: 'Файлы', folderId: 0 },
    ])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)
    const [drag, setDrag] = useState(false)
    const [searchFileName, setSearchFileName] = useState('')

    const handleFolderClick = async (
        folder: any,
        title: string,
        folderId: number
    ) => {
        try {
            const response = await fetch(`/api/folder/${folderId}/contents`)
            const data = await response.json()
            setCurrentPath([data])
            setBreadcrumbPath([...breadcrumbPath, { title, folderId }])
            setCurrentFolderId(folderId)
        } catch (err) {
            console.error('Ошибка при получении содержимого папки:', err)
        }
    }

    const { dragStartHandler, dragLeaveHandler, onDrophandler } =
        useDragHandlers(currentFolderId, setData, setFileExtension, setDrag)

    useEffect(() => {
        if (data.files) {
            router.post(route('file.upload'), data)
        }
    }, [data])

    useEffect(() => {
        if (currentPath.length === 1) {
            setCurrentPath([FoldersFilesTree])
        }
    }, [FoldersFilesTree, currentPath.length])

    // Поиск по названию
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFileName(e.target.value)
    }

    // Фильтрация
    const getFilteredItems = () => {
        const currentItems = currentPath[currentPath.length - 1] || []

        const filtered = currentItems.filter(
            (item: any) =>
                item.name
                    ?.toLowerCase()
                    .includes(searchFileName.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchFileName.toLowerCase())
        )

        return filtered.sort((a: any, b: any) => {
            const aIsFolder = a.hasOwnProperty('title')
            const bIsFolder = b.hasOwnProperty('title')

            if (aIsFolder && !bIsFolder) return -1
            if (!aIsFolder && bIsFolder) return 1

            if (filterType === 'name') {
                const aName = (a.name || a.title || '').toLowerCase()
                const bName = (b.name || b.title || '').toLowerCase()
                return sortDirection === 'asc'
                    ? aName.localeCompare(bName)
                    : bName.localeCompare(aName)
            } else {
                const aDate = new Date(a[filterType] || 0).getTime()
                const bDate = new Date(b[filterType] || 0).getTime()
                return sortDirection === 'asc' ? aDate - bDate : bDate - aDate
            }
        })
    }

    const filteredItems = getFilteredItems()

    // Сброс фильтров
    const resetFilters = () => {
        setFilterType('name')
        setSortDirection('asc')
        setSearchFileName('')
    }

    return (
        <>
            {drag ? (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border-2 border-dashed shadow">
                    <div
                        className="h-full w-full p-5"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                        onDrop={(e) => onDrophandler(e)}>
                        <div className="flex h-[33vh] flex-col items-center justify-center gap-4 sm:px-5">
                            <div className="rounded-full border border-dashed p-3">
                                <Upload
                                    className="size-7 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex flex-col gap-px">
                                <p className="text-center text-xl font-medium text-muted-foreground">
                                    Перетащите файлы, чтобы загрузить
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="expend-h m-1 flex min-h-screen flex-wrap rounded-lg border shadow">
                    <div
                        className="h-full w-full p-5"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex w-full flex-col gap-4 md:w-auto md:min-w-[240px] md:max-w-sm">
                                    <SearchFileInput
                                        searchFileName={searchFileName}
                                        handleSearchChange={handleSearchChange}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <ViewControls
                                        viewMode={viewMode}
                                        setViewMode={setViewMode}
                                        itemSize={itemSize}
                                        setItemSize={setItemSize}
                                    />
                                    <FilterControls
                                        filterType={filterType}
                                        setFilterType={setFilterType}
                                        sortDirection={sortDirection}
                                        setSortDirection={setSortDirection}
                                        onReset={resetFilters}
                                    />
                                </div>
                            </div>

                            <BreadcrumbFile
                                breadcrumbPath={breadcrumbPath}
                                currentPath={currentPath}
                                setCurrentPath={setCurrentPath}
                                setBreadcrumbPath={setBreadcrumbPath}
                                setCurrentFolderId={setCurrentFolderId}
                                currentFolderId={currentFolderId}
                            />

                            <FoldersAndFiles
                                filteredItems={filteredItems}
                                currentPath={currentPath}
                                handleFolderClick={handleFolderClick}
                                accessLink={accessLink}
                                viewMode={viewMode}
                                itemSize={itemSize}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

'use client'

import type {
    Folder as FolderTypes,
    PageProps,
    File as FileTypes,
} from '@/types'
import { useForm } from '@inertiajs/react'
import type React from 'react'
import { useEffect, useState } from 'react'
import FoldersAndFiles from './MainFilesComponents/FoldersAndFiles'
import BreadcrumbFile from './MainFilesComponents/BreadcrumbFile'
import { Upload } from 'lucide-react'
import SearchFileInput from '@/Components/Files/MainFilesComponents/SearchFileInput'
import { Separator } from '@/Components/ui/separator'
import FilterControls, {
    FilterType,
    SortDirection,
} from '@/Components/Files/MainFilesComponents/FoldersAndFiles/FilterControls'
import { router, usePage } from '@inertiajs/react'

export type FolderOrFile = any

export default function MainFiles({
    FoldersFilesTree,
    accessLink,
}: {
    auth: PageProps['auth']
    FoldersTree: FolderTypes[]
    FoldersFilesTree: any[]
    accessLink?: string
}) {
    const { data, setData, post, processing } = useForm({
        folder_id: null as number | null,
        files: null as File[] | null,
        file_name: null as string | null,
    })

    const [fileExtension, setFileExtension] = useState<string | null>(null)
    const [currentPath, setCurrentPath] = useState<FolderOrFile[][]>([
        FoldersFilesTree,
    ])
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Файлы'])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)
    const [drag, setDrag] = useState(false)
    const [searchFileName, setSearchFileName] = useState('')
    const [filterType, setFilterType] = useState<FilterType>('name')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const { url } = usePage()

    const handleFolderClick = (
        children: FolderTypes[] | undefined,
        files: FileTypes[] | undefined,
        title: string,
        folderId: number
    ) => {
        const combinedItems: FolderOrFile[] = []

        if (Array.isArray(children)) {
            combinedItems.push(...children)
        }

        if (files && !Array.isArray(files)) {
            combinedItems.push(...Object.values(files))
        } else if (Array.isArray(files)) {
            combinedItems.push(...files)
        }

        if (combinedItems.length === 0 && Array.isArray(files)) {
            combinedItems.push(...files)
        }

        setCurrentPath([...currentPath, combinedItems])
        setBreadcrumbPath([...breadcrumbPath, title])
        setCurrentFolderId(folderId)
    }

    function dragStartHandler(e: any) {
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFileName(e.target.value)
    }

    const getFilteredItems = () => {
        const currentItems = currentPath[currentPath.length - 1] || []

        const filtered = currentItems.filter(
            (item) =>
                item.name
                    ?.toLowerCase()
                    .includes(searchFileName.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchFileName.toLowerCase())
        )

        return filtered.sort((a, b) => {
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
                                <p className="text-m text-center text-muted-foreground/70">
                                    Максимальный размер одного файла - 2ГБ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                    <div
                        className="h-full w-full p-5"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-1 items-center gap-5">
                                <SearchFileInput
                                    searchFileName={searchFileName}
                                    handleSearchChange={handleSearchChange}
                                />
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <BreadcrumbFile
                                    breadcrumbPath={breadcrumbPath}
                                    currentPath={currentPath}
                                    setCurrentPath={setCurrentPath}
                                    setBreadcrumbPath={setBreadcrumbPath}
                                    setCurrentFolderId={setCurrentFolderId}
                                />
                            </div>
                            <FilterControls
                                filterType={filterType}
                                setFilterType={setFilterType}
                                sortDirection={sortDirection}
                                setSortDirection={setSortDirection}
                                onReset={resetFilters}
                            />
                        </div>
                        <FoldersAndFiles
                            filteredItems={filteredItems}
                            currentPath={currentPath}
                            handleFolderClick={handleFolderClick}
                            accessLink={accessLink}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

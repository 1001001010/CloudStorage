'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'
import {
    FoldersAndFiles,
    BreadcrumbFile,
    SearchFileInput,
    FilterControls,
    ViewControls,
} from '@/Components/Files/MainFilesComponents/index'
import { useSettingsStore } from '@/store/settings-store'
import { useDragHandlers } from '@/hooks/use-drag-handlers'
import { Upload } from 'lucide-react'
import { useFilesStore } from '@/store/use-file-store'
import { getFilteredItems } from '@/lib/utils'

export default function MainFiles({
    FoldersFilesTree,
    accessLink,
}: {
    FoldersFilesTree: any[]
    accessLink?: string
}) {
    // Форма загрузки файла
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
    } = useSettingsStore() // Получаем настройки из хранилища

    const {
        currentPath,
        setCurrentPath,
        breadcrumbPath,
        setBreadcrumbPath,
        currentFolderId,
        setCurrentFolderId,
    } = useFilesStore() // Получаем действительный путь из хранилища

    const [fileExtension, setFileExtension] = useState<string | null>(null)
    const [drag, setDrag] = useState(false)
    const [select, setSelect] = useState<{
        type: 'file' | 'folder'
        id: number
    } | null>(null)
    const [searchFileName, setSearchFileName] = useState('')
    const { dragStartHandler, dragLeaveHandler, onDrophandler } =
        useDragHandlers(currentFolderId, setData, setFileExtension, setDrag)

    // Обработка клика по папке
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

    // Отслеживание изменения данных в форме
    useEffect(() => {
        if (data.files) {
            router.post(route('file.upload'), data, {
                onSuccess: async () => {
                    try {
                        const response = await fetch(
                            `/api/folder/${currentFolderId}/contents`
                        )
                        const updatedData = await response.json()
                        setCurrentPath([updatedData])
                    } catch (error) {
                        console.error(
                            'Ошибка при обновлении содержимого папки после загрузки:',
                            error
                        )
                    }
                },
            })
        }
    }, [data])

    // Обновление пути
    useEffect(() => {
        if (currentPath.length === 0) {
            setCurrentPath([FoldersFilesTree])
        }
    }, [FoldersFilesTree, currentPath.length])

    // Слушаем событие создания папки для обновления списка
    useEffect(() => {
        const handleFolderCreated = async () => {
            try {
                const response = await fetch(
                    `/api/folder/${currentFolderId}/contents`
                )
                const updatedData = await response.json()
                setCurrentPath([updatedData])
            } catch (error) {
                console.error(
                    'Ошибка при обновлении содержимого папки после создания:',
                    error
                )
            }
        }

        window.addEventListener('folder-created', handleFolderCreated)

        return () => {
            window.removeEventListener('folder-created', handleFolderCreated)
        }
    }, [currentFolderId])

    // Поиск по названию
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFileName(e.target.value)
    }

    // Фильтрация
    const filteredItems = getFilteredItems(searchFileName)

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
                        onDragOver={(e) => dragStartHandler(e)}
                        onClick={() => setSelect(null)}>
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

                            <BreadcrumbFile />

                            <FoldersAndFiles
                                select={select}
                                setSelect={setSelect}
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

'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/Components/ui/breadcrumb'
import { useFilesStore } from '@/store/use-file-store'
import type React from 'react'

export type FolderOrFile = any

type BreadcrumbItemType = {
    title: string
    folderId: number
}

export default function BreadcrumbFile() {
    const {
        setCurrentPath,
        breadcrumbPath,
        setBreadcrumbPath,
        setCurrentFolderId,
    } = useFilesStore()

    const handleBreadcrumbClick = async (folderId: number) => {
        try {
            const index = breadcrumbPath.findIndex(
                (item) => item.folderId === folderId
            )

            const response = await fetch(`/api/folder/${folderId}/contents`)
            const data = await response.json()

            setCurrentPath([data])
            setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
            setCurrentFolderId(folderId)
        } catch (err) {
            console.error('Ошибка при получении содержимого папки:', err)
        }
    }

    return (
        <div className="w-max overflow-x-auto pl-2">
            <Breadcrumb>
                <BreadcrumbList className="flex-nowrap">
                    {breadcrumbPath.map(({ title, folderId }, index) => (
                        <BreadcrumbItem
                            key={index}
                            className="whitespace-nowrap">
                            <BreadcrumbLink
                                className="cursor-pointer"
                                onClick={() => handleBreadcrumbClick(folderId)}>
                                {title}
                            </BreadcrumbLink>
                            {index < breadcrumbPath.length - 1 && '/'}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

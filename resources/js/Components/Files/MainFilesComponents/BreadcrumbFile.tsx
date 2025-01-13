import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'

export type FolderOrFile = any

export default function BreadcrumbFile({
    breadcrumbPath,
    currentPath,
    setCurrentPath,
    setBreadcrumbPath,
    setCurrentFolderId,
}: {
    breadcrumbPath: string[]
    currentPath: FolderOrFile[][]
    setCurrentPath: React.Dispatch<React.SetStateAction<FolderOrFile[][]>>
    setBreadcrumbPath: React.Dispatch<React.SetStateAction<string[]>>
    setCurrentFolderId: React.Dispatch<React.SetStateAction<number>>
}) {
    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1))
        setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
        setCurrentFolderId(index === 0 ? 0 : currentPath[index][0].id)
    }
    return (
        <>
            <Breadcrumb className="pb-2">
                <BreadcrumbList>
                    {breadcrumbPath.map((title, index) => (
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink
                                className="cursor-pointer"
                                onClick={() => handleBreadcrumbClick(index)}>
                                {title}
                            </BreadcrumbLink>
                            {index < breadcrumbPath.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </>
    )
}

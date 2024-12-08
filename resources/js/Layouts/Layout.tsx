'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar'
import SideBarComponent from '@/Components/Sidebar'
import {
    PropsWithChildren,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Link } from '@inertiajs/react'
import { Folder } from '@/types'
import { toast } from 'sonner'

const getInitialSidebarState = () => {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('sidebar:state'))
        ?.split('=')[1]
    return cookieValue === 'true'
}

export default function Layout({
    children,
    BreadLvl1,
    BreadLvl2,
    BreadLvl3,
    FoldersTree,
    totalSize,
    msg,
}: PropsWithChildren<{
    header?: ReactNode
    BreadLvl1?: string
    BreadLvl2?: string
    BreadLvl3?: string
    FoldersTree: Folder[]
    totalSize: number
    msg?: string
}>) {
    const [defaultOpen, setDefaultOpen] = useState(getInitialSidebarState)
    const hasShownMessage = useRef(false)

    useEffect(() => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('sidebar:state'))
            ?.split('=')[1]
        setDefaultOpen(cookieValue === 'true')
    }, [])

    useEffect(() => {
        if (msg && !hasShownMessage.current) {
            toast(msg)
            hasShownMessage.current = true
        }
    }, [msg])

    return (
        <>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '19rem',
                    } as React.CSSProperties
                }
                defaultOpen={defaultOpen}>
                <SideBarComponent
                    FoldersTree={FoldersTree}
                    totalSize={totalSize}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <Link href={route('index')}>
                                        <BreadcrumbLink>
                                            Файловое хранилище
                                        </BreadcrumbLink>
                                    </Link>
                                </BreadcrumbItem>
                                {BreadLvl1 ? (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbPage>
                                                {BreadLvl1}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                ) : null}
                                {BreadLvl2 ? (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {BreadLvl2}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                ) : null}
                                {BreadLvl3 ? (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {BreadLvl3}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                ) : null}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

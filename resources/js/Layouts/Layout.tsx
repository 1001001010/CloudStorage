'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import { Separator } from '@/Components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar'
import SideBarComponent from '@/Components/Sidebar/Sidebar'
import React, {
    PropsWithChildren,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Link } from '@inertiajs/react'
import { Folder, ToastMessage } from '@/types'
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
    breadcrumbs = [],
    FoldersTree,
    totalSize,
    msg,
}: PropsWithChildren<{
    header?: ReactNode
    breadcrumbs?: string[]
    FoldersTree: Folder[]
    totalSize: number
    msg?: ToastMessage
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
            toast(msg.title, {
                description: msg.description ? msg.description : undefined,

                // action: msg.action
                //     ? {
                //           label: msg.action?.label,
                //           onClick: () => {
                //               navigator.clipboard.writeText(textToCopy)
                //           },
                //       }
                //     : null,
            })
            hasShownMessage.current = true
        }
    }, [msg])

    return (
        <>
            <SidebarProvider
                style={{ '--sidebar-width': '19rem' } as React.CSSProperties}
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

                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {breadcrumb}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

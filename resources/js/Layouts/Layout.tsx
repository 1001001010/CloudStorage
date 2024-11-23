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
import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { useDarkMode } from '@/Components/ThemeButton'

export default function Layout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    return (
        <>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '19rem',
                    } as React.CSSProperties
                }
                defaultOpen={false}>
                <SideBarComponent children={children} />
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
                                    <BreadcrumbLink href={route('index')}>
                                        Файловое хранилище
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Data Fetching
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

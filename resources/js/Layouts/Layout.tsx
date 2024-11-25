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

export default function Layout({
    children,
    BreadLvl1,
    BreadLvl2,
    BreadLvl3,
    auth,
}: PropsWithChildren<{
    header?: ReactNode
    BreadLvl1?: string
    BreadLvl2?: string
    BreadLvl3?: string
    auth: any
}>) {
    return (
        <>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '19rem',
                    } as React.CSSProperties
                }
                defaultOpen={auth.user ? true : false}>
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

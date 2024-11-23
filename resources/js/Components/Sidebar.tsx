'use client'

import * as React from 'react'
import { ChevronRight, Files, GalleryVerticalEnd } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/Components/ui/sidebar'
import { usePage } from '@inertiajs/react'
import UserDropDownMenu from './UserDropDowrnMenu'
import ThemeButton from './ThemeButton'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './ui/collapsible'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Progress } from '@/Components/ui/progress'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export const iframeHeight = '800px'

const data = {
    navMain: [
        {
            title: 'Все файлы',
            url: '#',
            icon: Files,
            isActive: true,
            items: [
                {
                    title: 'Недавнее',
                    url: '#',
                },
                {
                    title: 'Фото',
                    url: '#',
                },
                {
                    title: 'Видео',
                    url: '#',
                },
                {
                    title: 'Архивы',
                    url: '#',
                },
                {
                    title: 'Документы',
                    url: '#',
                },
            ],
        },
    ],
}

export default function SideBarComponent({
    children,
}: {
    children: React.ReactNode
}) {
    const { open } = useSidebar()
    const user = usePage().props.auth

    return (
        <>
            <Sidebar variant="floating" collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">
                                            Файловое хранилище
                                        </span>
                                        <span className="">v1.0.0</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild>
                                                            <a
                                                                href={
                                                                    subItem.url
                                                                }>
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <ThemeButton auth={user}></ThemeButton>
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.1 }}>
                                <Alert>
                                    <Progress value={50} />
                                    <AlertTitle className="pt-2 text-center">
                                        <p className="text-nowrap">
                                            Занято 2.5 ГБ из 5ГБ
                                        </p>
                                    </AlertTitle>
                                    <AlertDescription className="flex justify-center pt-2">
                                        <Button className="w-full">
                                            Увеличить
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <UserDropDownMenu auth={user}></UserDropDownMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}

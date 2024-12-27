'use client'

import { ChevronRight, Files, Folder } from 'lucide-react'
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/Components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible'
export const iframeHeight = '800px'

const data = {
    navMain: [
        {
            title: 'Все файлы',
            url: '#',
            icon: Files,
            isActive: false,
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
        {
            title: 'Папки',
            url: '#',
            icon: Folder,
            isActive: false,
            items: [
                {
                    title: 'Папка 1',
                    url: '#',
                },
                {
                    title: 'Папка 2',
                    url: '#',
                },
                {
                    title: 'Папка 3',
                    url: '#',
                },
                {
                    title: 'Папка 4',
                    url: '#',
                },
                {
                    title: 'Папка 5',
                    url: '#',
                },
            ],
        },
    ],
}

export default function UserDataLink() {
    return (
        <>
            {data.navMain.map((item) => (
                <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.items?.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <a href={subItem.url}>
                                            <SidebarMenuSubButton asChild>
                                                <span>{subItem.title}</span>
                                            </SidebarMenuSubButton>
                                        </a>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </>
    )
}

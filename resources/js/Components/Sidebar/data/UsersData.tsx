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
import { Folder as FolderType } from '@/types'
import { Link } from '@inertiajs/react'
export const iframeHeight = '800px'

export default function UserDataLink({
    FoldersTree,
}: {
    FoldersTree: FolderType[]
}) {
    const navData = {
        navMain: [
            {
                title: 'Файлы',
                url: '#',
                icon: Files,
                isActive: false,
                items: [
                    { title: 'Все файлы', url: '/' },
                    { title: 'Фото', url: '/photos' },
                    { title: 'Видео', url: '/videos' },
                    { title: 'Архивы', url: '/archives' },
                    { title: 'Документы', url: '/documents' },
                ],
            },
        ],
    }

    return (
        <>
            {navData.navMain.map((item) => (
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
                                        <Link href={subItem.url}>
                                            <SidebarMenuSubButton asChild>
                                                <span>{subItem.title}</span>
                                            </SidebarMenuSubButton>
                                        </Link>
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

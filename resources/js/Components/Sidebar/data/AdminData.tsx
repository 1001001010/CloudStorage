'use client'

import { ChevronRight, ScanEye } from 'lucide-react'
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
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
export const iframeHeight = '800px'

const data = {
    navMain: [
        {
            title: 'Панель администратора',
            url: '#',
            icon: ScanEye,
            isActive: false,
            items: [
                {
                    title: 'Пользователи',
                    url: route('admin.users'),
                },
                {
                    title: 'Статистика',
                    url: route('admin.stats'),
                },
            ],
        },
    ],
}

export default function AdminDataLink({ auth }: PageProps<{}>) {
    return (
        <>
            {auth.user && auth.user.is_admin == true ? (
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
                                            <SidebarMenuSubItem
                                                key={subItem.title}>
                                                <Link href={subItem.url}>
                                                    <SidebarMenuSubButton
                                                        asChild>
                                                        <span>
                                                            {subItem.title}
                                                        </span>
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
            ) : null}
        </>
    )
}

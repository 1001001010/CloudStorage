"use client";

import * as React from "react";
import {
    BadgeCheck,
    Bell,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    Files,
    GalleryVerticalEnd,
    Home,
    LogOut,
    MoonStar,
    Sparkles,
    SquareTerminal,
    SunMedium,
    Terminal,
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/Components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarRail,
    useSidebar,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import UserDropDownMenu from "./UserDropDowrnMenu";
import { User } from "@/types";
import ThemeButton from "./ThemeButton";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/components/ui/button";

export const iframeHeight = "800px";

const data = {
    navMain: [
        {
            title: "Все файлы",
            url: "#",
            icon: Files,
            isActive: true,
            items: [
                {
                    title: "Недавнее",
                    url: "#",
                },
                {
                    title: "Фото",
                    url: "#",
                },
                {
                    title: "Видео",
                    url: "#",
                },
                {
                    title: "Архивы",
                    url: "#",
                },
                {
                    title: "Документы",
                    url: "#",
                },
            ],
        },
    ],
};

export default function SideBarComponent({
    children,
}: // open,
{
    children: React.ReactNode;
    // open: boolean;
}) {
    // const { open } = useSidebar();

    const user = usePage().props.auth;

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
            defaultOpen={false}
        >
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
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                        >
                                                            <a
                                                                href={
                                                                    subItem.url
                                                                }
                                                            >
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
                    {/* {open == true ? (
                        <Alert>
                            <Progress value={50} />
                            <AlertTitle className="pt-2 text-center">
                                Занято 2.5 ГБ из 5ГБ
                            </AlertTitle>
                            <AlertDescription className="pt-2 flex justify-center">
                                <Button className="w-full">Увеличить</Button>
                            </AlertDescription>
                        </Alert>
                    ) : null} */}
                    <UserDropDownMenu auth={user}></UserDropDownMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={route("index")}>
                                    Файловое хранилище
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div> */}
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

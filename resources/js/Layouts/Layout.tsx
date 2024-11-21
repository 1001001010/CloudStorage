import SideBarComponent from "@/Components/Sidebar";
import { useSidebar } from "@/Components/ui/sidebar";
import { User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Layout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    // const { open } = useSidebar();

    // console.log(open);

    // const open = true;
    return (
        <>
            <SideBarComponent children={children} />
        </>
    );
}

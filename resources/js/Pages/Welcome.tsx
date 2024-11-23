import { PageProps } from "@/types";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Link } from "@inertiajs/react";

export default function Welcome({ auth }: PageProps<{}>) {
    return (
        <>
            <Layout>
                {auth.user ? null : (
                    <Dialog open={true}>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                <div className="aspect-video rounded-xl bg-muted/50" />
                                <div className="aspect-video rounded-xl bg-muted/50" />
                                <div className="aspect-video rounded-xl bg-muted/50" />
                            </div>
                            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                        </div>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Авторизируйтесь</DialogTitle>
                                <DialogDescription>
                                    Для использования файлового хранилища
                                    необходимо авторизоваться
                                    <Link href={route("login")}>
                                        <Button className="w-full my-3">
                                            Вход
                                        </Button>
                                    </Link>
                                    <Link href={route("register")}>
                                        <p className="text-sm text-center text-muted-foreground">
                                            Регистрация
                                        </p>
                                    </Link>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}
            </Layout>
        </>
    );
}

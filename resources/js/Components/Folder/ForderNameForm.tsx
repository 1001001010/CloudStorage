import { PageProps } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForderNameForm({}: PageProps<{}>) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">Создать здесь</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Создание папки</DialogTitle>
                        <DialogDescription>
                            Введите название для папки
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            id="name"
                            name="name"
                            placeholder="Название папки"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Создать</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

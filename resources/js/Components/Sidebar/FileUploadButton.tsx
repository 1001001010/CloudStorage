import React, { useEffect } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";

export default function FileUploadButton({ open }: PageProps<{ open: boolean }>) {
    const { data, setData, post } = useForm({
        folder_id:  null,
        files: null as File[] | null,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setData("files", Array.from(event.target.files));
        }
    };

    useEffect(() => {
        if (data.files && data.files.length > 0) {
            post(route("file.upload"), {
                onSuccess: () => setData("files", null),
            });
        }
    }, [data.files]); // useEffect следит за изменением data.files

    return (
        <div>
            <input
                id="fileInput"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />
            <Button className="flex w-full" onClick={() => document.getElementById("fileInput")?.click()}>
                <Upload />
                {open && <p>Загрузить</p>}
            </Button>
        </div>
    );
}

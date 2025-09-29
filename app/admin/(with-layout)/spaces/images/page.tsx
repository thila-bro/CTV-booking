
'use client';
import { getSpaceImagesRepo } from "@/repositories/space-images";
import { useSearchParams } from "next/dist/client/components/navigation";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/app/ui/button";
import { deleteSpaceImage } from "../action";
import ImageUploader from "@/app/ui/admin/ImageUploader";
import { se, tr } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";




export default function Page() {
    const searchParams = useSearchParams();
    const spaceId = searchParams.get("spaceId");
    // const spaceImages = await getSpaceImagesRepo(spaceId as string);
    const [isLoading, setIsLoading] = useState(true);
    const [spaceImages, setSpaceImages] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getSpaceImagesRepo(spaceId as string).then((data) => {
            setSpaceImages(data);
            setIsLoading(false);
        });

    }, []);

    const handleImageDelete = async (imageId: string) => {
        setIsLoading(true);
        deleteSpaceImage(imageId).then((response) => {
            if (response.success) {
                setSpaceImages(spaceImages.filter(img => img.id !== imageId));
                toast.success("Image deleted successfully");
            }
            setIsLoading(false);
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Space Images</h1>
                <div className="flex items-center">
                    <Button className="mr-2">
                        <Link
                            href="/admin/spaces"
                            className="text-blue-600 hover:underline">
                            {`<-`}
                        </Link>
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="mr-2"
                                onClick={() => setOpen(true)}
                            >
                                Add Image
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='mb-4'>Add Images</DialogTitle>
                                <DialogDescription>
                                    <ImageUploader
                                        spaceId={spaceId as string}
                                        onUploadSuccess={(newImages) => {
                                            // setSpaceImages([...spaceImages, ...newImages]);
                                            setSpaceImages(newImages);
                                            setOpen(false);
                                        }}
                                    />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spaceImages.map((img, index) => (
                        <TableRow key={index}>
                            <TableCell>{(index + 1).toString().padStart(3, '0')}</TableCell>
                            <TableCell>
                                <Image
                                    src={`/${img.image_url}`}
                                    alt={`${index + 1}`}
                                    width={300}
                                    height={200}
                                />
                            </TableCell>
                            <TableCell>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={() => handleImageDelete(img.id)}
                                >
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
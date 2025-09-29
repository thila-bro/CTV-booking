import { uploadSpaceImages } from "@/app/admin/(with-layout)/spaces/action";
import { Button } from "@/app/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ImageUploader({
    spaceId,
    onUploadSuccess,
}: {
    spaceId: string,
    onUploadSuccess: (imgs: any[]) => void
}) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [inputKey, setInputKey] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);

        // Generate previews
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    // Remove a selected file and its preview by index
    const handleRemoveImage = (idx: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== idx);
        const newPreviews = previews.filter((_, i) => i !== idx);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        // Reset input by changing key
        setInputKey(prev => prev + 1);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFiles.length) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("spaceId", spaceId);
        selectedFiles.forEach(file => formData.append("images", file));

        // Call your upload action (should return array of new image objects)
        const result = await uploadSpaceImages(formData);
        console.log("Upload result:", result);
        if (result?.success && result.images) {
            onUploadSuccess(result.data);
            setSelectedFiles([]);
            setPreviews([]);
            setInputKey(prev => prev + 1); // Reset input after upload
        }
        setUploading(false);
        toast.success("Upload completed");
    };

    return (
        <form onSubmit={handleUpload}>
            <Input
                key={inputKey} // <-- Add this
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="mb-4"
                onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-2 mb-4">
                {previews.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-24 h-24 object-cover rounded border cursor-pointer"
                        title="Click to remove"
                        onClick={() => handleRemoveImage(idx)}
                    />
                ))}
            </div>
            <Button type="submit" disabled={uploading || !selectedFiles.length}>
                {uploading ? "Uploading..." : "Upload"}
            </Button>
        </form>
    );
}
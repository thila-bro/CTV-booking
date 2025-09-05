
// import { usePathname } from 'next/navigation';
import { getSpaceImagesRepo } from "@/repositories/space-images";
import Image from "next/image";


export default async function Page({params}: {params: {id: string}}) {
    const spaceId = params.id
    const spaceImages = await getSpaceImagesRepo(spaceId);

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {spaceImages.map((img, index) => (
                <Image
                    key={index}
                    src={`/${img.image_url}`}
                    alt={`${index + 1}`}
                    width={300}
                    height={200}
                />
            ))}
        </div>
    )
}
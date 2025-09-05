
// import { usePathname } from 'next/navigation';
import fs from "fs";
import path from "path";
import Image from "next/image";


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { headers } from 'next/headers';



export default function Page(request: NextRequest) {
    // const pathname = usePathname(); // e.g., '/users/flavio/test'
    // const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);


    // const requestHeaders = new Headers(request.headers);
    // // requestHeaders.set('x-url', request.url); // Set the full URL in a custom header

    // console.log("request headers: ", request.url);

    // const headersList = headers();
    // const pathname = headersList.get('x-current-path');
    // const id = pathname?.substring(pathname.lastIndexOf('/') + 1);

    // const path = request.params;

    // console.log("path: ", path);


    // const id = path.substring(path.lastIndexOf('/') + 1);

    // console.log("path: ", path);
    // console.log("id: ", id);



    // const imagesDir = path.join(process.cwd(), "public", "spaces", id);
    // const images = fs.readdirSync(imagesDir);

    // console.log("image dir: ", imagesDir);

    // console.log(filenames);

    // Only allow image files
    // const images = filenames.filter((file) =>
    //     /\.(png|jpe?g|gif|webp|svg)$/i.test(file)
    // );

    // return {
    //     props: { images }, // pass to component as props
    // };

    return <>Testing</>;




    // return (
    //     <div className="grid grid-cols-3 gap-4 p-4">
    //         {images.map((img, index) => (
    //             <Image
    //                 key={index}
    //                 src={`/spaces/${id}/${img}`}
    //                 alt={`${index + 1}`}
    //                 width={300}
    //                 height={200}
    //             />
    //         ))}
    //     </div>
    // )
}
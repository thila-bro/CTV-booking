'use client';

import { Button } from "@/components/ui/button";
import { getAllSpacesRepo } from '@/repositories/spaces';
import { useState, useEffect, useRef } from 'react';
import { userSessionCookieName } from '@/lib/constant';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";



export default function PublishedSpacesList() {
    const [spaces, setSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    useEffect(() => {
        setIsLoading(true);
        getAllSpacesRepo().then((data) => {
            console.log(data);
            setSpaces(data);
            setIsLoading(false);
        });
        // Check user login status (this is a placeholder, replace with actual logic)
        const userLoggedIn = document.cookie.includes(userSessionCookieName);
        setIsUserLoggedIn(userLoggedIn);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    // Dynamically set grid columns based on spaces count
    const gridCols =
        spaces.length >= 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : `grid-cols-1 sm:grid-cols-4 lg:grid-cols-${spaces.length}`;

    return (
        <>
            <section className="py-20 bg-gray-100 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Spaces</h2>
                <div className="flex justify-center">
                    <div className={`grid ${gridCols} gap-8 max-w-7xl w-full mx-auto`}>
                        {spaces.map((space, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow overflow-hidden flex flex-col"
                            >
                                {/* <img
                                    src="/sample.avif"
                                    alt={space.name}
                                    className="w-full h-48 object-cover"
                                /> */}
                                <Carousel className="w-full max-w-xs"
                                    plugins={[plugin.current]}
                                    onMouseEnter={plugin.current.stop}
                                    onMouseLeave={plugin.current.reset}>
                                    <CarouselContent key={idx}>
                                        {(space?.images?.length
                                            ? space.images
                                            : Array.from({ length: 5 }).map((_, i) => `/sample${i + 1}.avif`)
                                        ).map((img, idx) => (
                                            <img key={idx} src={img.image_url} alt={`Space image ${idx + 1}`} className="object-cover w-full h-full rounded-t-lg" />
                                        ))}
                                    </CarouselContent>
                                </Carousel>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold mb-2">{space.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {space?.is_price_per_hr_enabled && <>${space.price_per_hr}/hr &nbsp;</>}
                                        {space?.is_price_per_day_enabled && <>| ${space.price_per_day}/day &nbsp;</>}
                                        {space?.is_price_per_month_enabled && <>| ${space.price_per_month}/month</>}
                                    </p>
                                    {isUserLoggedIn ? (
                                        <Link href={{
                                            pathname: '/user/checkout',
                                            query: {
                                                spaceId: space.id,
                                            }
                                        }}>
                                            <Button className="mt-auto w-full">
                                                Book Now
                                            </Button>
                                        </Link>
                                    ) : (
                                        <p className="text-sm text-gray-600 mb-4">Please log in to book</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

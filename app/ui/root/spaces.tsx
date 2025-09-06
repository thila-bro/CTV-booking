'use client';

import { Button } from "@/components/ui/button";
import { getAllSpacesRepo } from '@/repositories/spaces';
import { useState, useEffect } from 'react';
import { userSessionCookieName } from '@/lib/constant';
import Link from 'next/link';


export default function PublishedSpacesList() {
    const [spaces, setSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllSpacesRepo().then((data) => {
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

    return (
        <>
            <section className="py-20 bg-gray-100 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Spaces</h2>
                <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto mx-auto">
                    {spaces.map((space, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow overflow-hidden flex flex-col"
                        >
                            <img
                                // src={space.img}
                                src="/sample.avif"
                                alt={space.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold mb-2">{space.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">${space.price}/Hr</p>
                                {isUserLoggedIn ? (
                                    <Link href={{
                                        pathname: '/user/checkout',
                                        query: { spaceId: space.id }
                                    }}>
                                        <Button className="mt-auto w-full">
                                            Book Now
                                        </Button>
                                    </Link>
                                ): (<p className="text-sm text-gray-600 mb-4">Please log in to book</p>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

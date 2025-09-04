'use client';

import { getAllSpacesRepo } from '@/repositories/spaces';
import { useState, useEffect } from 'react';


export default function PublishedSpacesList() {
    const [spaces, setSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getAllSpacesRepo().then((data) => {
            setSpaces(data);
            setIsLoading(false);
        });
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
                                <button className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

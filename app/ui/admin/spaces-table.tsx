'use client';

import React from 'react'
import { getAllSpacesRepo } from '@/repositories/spaces';
import { deleteSpaceRepo, updateSpaceRepo } from '@/repositories/spaces';
import Link from 'next/link';
import {
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function SpaceTable() {
    const [spaces, setSpaces] = useState<{ id: string; name: string; price: number; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState({}); // To hold temporary edited data

    useEffect(() => {
        setIsLoading(true);
        getAllSpacesRepo().then((data) => {
            setSpaces(data.map((space: any) => ({
                id: space.id,
                name: space.name,
                price: space.price_per_hr, // Map price_per_hr to price
            })));
            setIsLoading(false);
        }
        );

    }, []);

    const handleDelete = async (id: string) => {
        setIsLoading(true);

        const response = await deleteSpaceRepo(id);
        if (response?.success) {
            // Handle error (e.g., show a notification)
            setSpaces(spaces.filter((space: any) => space.id !== id));
        }

        setIsLoading(false);
    }

    const handleChange = (e: any, fieldName: string) => {
        setEditedValues({ ...editedValues, [fieldName]: e.target.value });
    };

    const handleEdit = async (id: string) => {
        setEditingRowId(id);
        setEditedValues({ id: id });

    }

    const handleEditCancel = async (id: string) => {
        setEditingRowId(null);
    }

    const handleSaveEdit = async (id: string) => {
        const nameElement = document.getElementById("name");
        const name = nameElement ? (nameElement as HTMLInputElement).value : '';
        const priceElement = document.getElementById("price");
        const price = priceElement ? (priceElement as HTMLInputElement).value : '';

        setIsLoading(true);
        const response = await updateSpaceRepo({ id, name, price })

        if (response?.success) {
            setEditingRowId(null);

            const updatedSpaces = spaces.map((space) => {
                if (space.id === id) {
                    return { ...space, name, price: Number(price) };
                }
                return space;
            });
            setSpaces(updatedSpaces);
        }

        setIsLoading(false);
    }


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                    <tr>
                        <th className='px-4 py-2 border-b text-left'>ID</th>
                        <th className="px-4 py-2 border-b text-left">Name</th>
                        <th className="px-4 py-2 border-b text-left">Price</th>
                        <th className="px-4 py-2 border-b text-left">Images</th>
                        <th className="px-4 py-2 border-b text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {spaces.map((space: any, index) => (
                        <tr key={space.id}>
                            <td className='px-4 py-2 border-b'>{(index + 1).toString().padStart(3, '0')}</td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter new name"
                                        defaultValue={space.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                ) : (
                                    space.name
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="1"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter price"
                                        defaultValue={space.price}
                                        onChange={(e) => handleChange(e, 'price')}
                                    />
                                ) : (
                                    `$${space.price}`
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                <Link href={{
                                    pathname: `spaces/images/${space.id}`,
                                    query: { spaceId: space.id }
                                }}>All Images</Link>
                            </td>
                            <td className="px-4 py-2 border-b">
                                <div className='flex'>
                                    {editingRowId === space.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEdit(space.id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <CheckIcon className='w-5 h-5' />
                                            </button>
                                            <button
                                                onClick={() => handleEditCancel(space.id)}
                                                className="ml-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(space.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(space.id)}
                                                className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

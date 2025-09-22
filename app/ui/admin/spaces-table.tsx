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
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner"

export default function SpaceTable() {
    const [spaces, setSpaces] = useState<{ id: string; name: string; price: number; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState({}); // To hold temporary edited data

    useEffect(() => {
        setIsLoading(true);
        getAllSpacesRepo().then((data) => {
            setSpaces(data);
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

    const handleEdit = async (id: string, space: any) => {
        setEditingRowId(id);
        setEditedValues({ id: id, ...space });
    }

    const handleEditCancel = async (id: string) => {
        setEditingRowId(null);
    }

    const handleSaveEdit = async (id: string) => {
        setIsLoading(true);
        const response = await updateSpaceRepo({ id, ...editedValues });

        if (response?.success) {
            setEditingRowId(null);
            toast.success("Space updated successfully!");
            const updatedSpaces = spaces.map((space) => {
                if (space.id === id) {
                    return { ...space, ...editedValues };
                }
                return space;
            });
            setSpaces(updatedSpaces);
            setIsLoading(false);
        }

        // setIsLoading(false);
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
                        <th className="px-4 py-2 border-b text-left">Per Hr Price</th>
                        <th className="px-4 py-2 border-b text-left">Per Hour</th>
                        <th className="px-4 py-2 border-b text-left">Per Day Price</th>
                        <th className="px-4 py-2 border-b text-left">Per Day</th>
                        <th className="px-4 py-2 border-b text-left">Per Month Price</th>
                        <th className="px-4 py-2 border-b text-left">Per Month</th>
                        <th className="px-4 py-2 border-b text-left">Start Time</th>
                        <th className="px-4 py-2 border-b text-left">End Time</th>
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
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter new name"
                                        value={editedValues.name ?? space.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                ) : (
                                    space.name
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Input
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="1"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter price"
                                        value={editedValues.price_per_hr ?? space.price_per_hr}
                                        onChange={(e) => handleChange(e, 'price_per_hr')}
                                        disabled={!editedValues.is_price_per_hr_enabled}
                                    />
                                ) : (
                                    space.price_per_hr ? `$${space.price_per_hr}` : 'N/A'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Checkbox
                                        id="is_price_per_hr_enabled"
                                        name="is_price_per_hr_enabled"
                                        checked={editedValues.is_price_per_hr_enabled ?? pricePerHrEnabled}
                                        onCheckedChange={(checked) => setEditedValues({ 
                                            ...editedValues, 
                                            is_price_per_hr_enabled: checked === true,
                                            price_per_hr: checked === true ? editedValues.price_per_hr ?? space.price_per_hr : null
                                        })}
                                    />
                                ) : (
                                    space.is_price_per_hr_enabled ? 'Yes' : 'No'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Input
                                        type="number"
                                        id="price_per_day"
                                        name="price_per_day"
                                        min="0"
                                        step="1"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter price per day"
                                        value={editedValues.price_per_day ?? space.price_per_day}
                                        onChange={(e) => handleChange(e, 'price_per_day')}
                                        disabled={!editedValues.is_price_per_day_enabled}
                                    />
                                ) : (
                                    space.price_per_day ? `$${space.price_per_day}` : 'N/A'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Checkbox
                                        id="is_price_per_day_enabled"
                                        name="is_price_per_day_enabled"
                                        checked={editedValues.is_price_per_day_enabled ?? pricePerDayEnabled}
                                        onCheckedChange={(checked) => setEditedValues({ 
                                            ...editedValues, 
                                            is_price_per_day_enabled: checked === true, 
                                            price_per_day: checked === true ? editedValues.price_per_day ?? space.price_per_day : null 
                                        })}
                                    />
                                ) : (
                                    space.is_price_per_day_enabled ? 'Yes' : 'No'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Input
                                        type="number"
                                        id="price_per_month"
                                        name="price_per_month"
                                        min="0"
                                        step="1"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter price per month"
                                        value={editedValues.price_per_month ?? space.price_per_month}
                                        onChange={(e) => handleChange(e, 'price_per_month')}
                                        disabled={!editedValues.is_price_per_month_enabled}
                                    />
                                ) : (
                                    space.price_per_month ? `$${space.price_per_month}` : 'N/A'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Checkbox
                                        id="is_price_per_month_enabled"
                                        name="is_price_per_month_enabled"
                                        checked={editedValues.is_price_per_month_enabled ?? pricePerMonthEnabled}
                                        onCheckedChange={(checked) => setEditedValues({ 
                                            ...editedValues, 
                                            is_price_per_month_enabled: checked === true,
                                            price_per_month: checked === true ? editedValues.price_per_month ?? space.price_per_month : null 
                                        })} 
                                    />
                                ) : (
                                    space.is_price_per_month_enabled ? 'Yes' : 'No'
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Input
                                        type="time"
                                        id="start_time"
                                        name="start_time"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter start time"
                                        value={editedValues.start_time ?? space.start_time}
                                        onChange={(e) => handleChange(e, 'start_time')}
                                    />
                                ) : (
                                    space.start_time
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {editingRowId === space.id ? (
                                    <Input
                                        type="time"
                                        id="end_time"
                                        name="end_time"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring"
                                        placeholder="Enter end time"
                                        value={editedValues.end_time ?? space.end_time}
                                        onChange={(e) => handleChange(e, 'end_time')}
                                    />
                                ) : (
                                    space.end_time
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
                                                onClick={() => handleEdit(space.id, space)}
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

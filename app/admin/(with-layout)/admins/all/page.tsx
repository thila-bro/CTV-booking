'use client'

import React, { useEffect, useState } from 'react';
import { activateAdmin, deactivateAdmin, getAllActiveAdmins, resetAdminPassword } from '../action';
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
import { Button } from '@/app/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Admins() {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        getAllActiveAdmins().then(data => setAdmins(data));
    }, []);
    const [resetPassword, setResetPassword] = useState<{ [key: string]: string }>({});

    async function handleResetPassword(adminId: string, password: string): Promise<void> {
        resetAdminPassword(adminId, password).then((response) => {
            if (response?.success) {
                // Show success message
                toast.success("Password reset successfully!");
            }
        });
        setResetPassword({ ...resetPassword, [adminId]: "" });
    }

    async function handleDeactivate(adminId: string): Promise<void> {
        const response = await deactivateAdmin(adminId);

        if (response) {
            toast.error("Admin deactivation failed!");
        } else {
            toast.success("Admin deactivated successfully!");
        }

        const updatedAdmins = await getAllActiveAdmins();
        setAdmins(updatedAdmins);
    }

    async function handleActive(adminId: string): Promise<void> {
        const response = await activateAdmin(adminId);
        console.log(response);
        if (response) {
            toast.error("Admin activation failed!");
        } else {
            toast.success("Admin activated successfully!");
        }

        const updatedAdmins = await getAllActiveAdmins();
        setAdmins(updatedAdmins);
    }


    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Admins</h1>
            </div>
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins.map((admin) => (
                        <TableRow key={admin.id}>
                            <TableCell className="font-medium">{admin?.name}</TableCell>
                            <TableCell>{admin?.email}</TableCell>
                            <TableCell>{admin?.is_active ? "Active" : "Inactive"}</TableCell>
                            <TableCell className='flex'>
                                <Dialog key={`reset-${admin.id}`}>
                                    <DialogTrigger className="mr-2"><Button>Reset</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='mb-4'>Reset Password</DialogTitle>
                                            <DialogDescription>
                                                <form>
                                                    <Input
                                                        className='mb-4'
                                                        type="password"
                                                        name="password"
                                                        placeholder="New Password"
                                                        required
                                                        value={resetPassword[admin.id] || ""}
                                                        onChange={e => setResetPassword(prev => ({ ...prev, [admin.id]: e.target.value }))}
                                                    />
                                                    <DialogClose asChild>
                                                        <Button
                                                            className=''
                                                            type="button"
                                                            onClick={() => handleResetPassword(admin.id, resetPassword[admin.id])}>Reset Password
                                                        </Button>
                                                    </DialogClose>
                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                {admin.is_active && (
                                    <Button
                                        key={`delete-${admin.id}`}
                                        className='mr-2'
                                        onClick={() => { handleDeactivate(admin.id) }}
                                    >Disabled
                                    </Button>
                                )}
                                {!admin.is_active && (
                                    <Button
                                        key={`delete-${admin.id}`}
                                        className='mr-2'
                                        onClick={() => { handleActive(admin.id) }}
                                    >Enable
                                    </Button>
                                )}

                            </TableCell>
                        </TableRow>
                    ))}
                    {/* <TableRow>
                        <TableCell>INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell>$250.00</TableCell>
                    </TableRow> */}
                </TableBody>
            </Table>
        </div>
    )
}

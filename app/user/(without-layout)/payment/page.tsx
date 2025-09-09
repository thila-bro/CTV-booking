
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    PayPalScriptProvider,
    PayPalButtons,
} from "@paypal/react-paypal-js";

import { getTempBookingByIdRepo } from "@/repositories/temp-booking";
import { Row } from "postgres";
import { paymentSuccessAction } from "./action";


export default function PaymentSummaryPage() {
    const searchParams = useSearchParams();

    // loading state
    const preBookingId = searchParams.get("preBookingId");
    const [isLoading, setIsLoading] = useState(true);
    const [tempBooking, setTempBooking] = useState<Row | null>(null);
    const [space, setSpace] = useState<Row | null>(null);
    const [user, setUser] = useState<Row | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getTempBookingByIdRepo(preBookingId as string).then((data) => {
            setTempBooking(data);
            setSpace(data.space);
            setUser(data.user);
            setIsLoading(false);
        });
    }, []);

    const router = useRouter();
    const spaceName = space?.name;
    const date = tempBooking ? new Date(tempBooking.date).toLocaleDateString() : "--";
    const startTime = tempBooking ? tempBooking.start_time.slice(0, 5) : "--";
    const endTime = tempBooking ? tempBooking.end_time.slice(0, 5) : "--";
    const totalPrice = tempBooking ? parseFloat(tempBooking.total_price).toFixed(2) : "0.00";

    // Helper to build query string for booking details
    const buildSuccessUrl = (actions: any) => {        
        setIsLoading(true);
        paymentSuccessAction(preBookingId as string, actions).then(() => {
            setIsLoading(false);
            router.push(`/user/success?preBookingId=${preBookingId}`);
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
            <ul className="mb-4">
                <li className="flex justify-between py-2 border-b">
                    <span>Space</span>
                    <span className="font-medium">{spaceName}</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                    <span>Date</span>
                    <span className="font-medium">{date}</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                    <span>Start Time</span>
                    <span className="font-medium">{startTime}</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                    <span>End Time</span>
                    <span className="font-medium">{endTime}</span>
                </li>
            </ul>
            <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>A${parseFloat(totalPrice).toFixed(2)}</span>
            </div>

            <PayPalScriptProvider options={{
                clientId: "AQpxi8gzTkeEY7jxKS2f3L_FUPEYkSnNSoylO3GhMhHmcENQBcCzOJ2aGzWLgDSjv2pzo2p8EjWpPRKQ", // Replace with your real PayPal client ID
                // clientId: process.env.PAYPAL_CLIENT_ID as string,
                currency: "AUD",
                intent: "capture",
                components: "buttons,funding-eligibility"
            }}>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "AUD",
                                        value: parseFloat(totalPrice).toFixed(2),
                                    },
                                    description: `${spaceName} booking on ${date} (${startTime} - ${endTime})`,
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (!actions?.order) return;
                        await actions.order.capture()
                        const orderDetails = await actions.order.capture();
                        buildSuccessUrl(orderDetails);
                        
                        // router.push(buildSuccessUrl(actions));
                    }}
                    onError={(err) => {
                        alert("Payment could not be completed. Please try again.");
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}

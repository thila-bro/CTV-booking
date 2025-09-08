
"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";


export default function PaymentSummaryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const spaceName = searchParams.get("spaceName") || "Space";
    const date = searchParams.get("date") || "Not selected";
    const startTime = searchParams.get("startTime") || "--";
    const endTime = searchParams.get("endTime") || "--";
    const totalPrice = searchParams.get("totalPrice") || "0";

    // Helper to build query string for booking details
    const buildSuccessUrl = () => {
        const params = new URLSearchParams({
            spaceName,
            date,
            startTime,
            endTime,
            totalPrice,
        });
        return `/user/success?${params.toString()}`;
    };

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
                        await actions.order.capture();
                        router.push(buildSuccessUrl());
                    }}
                    onError={(err) => {
                        alert("Payment could not be completed. Please try again.");
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}

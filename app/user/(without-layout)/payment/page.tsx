"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    PayPalScriptProvider,
    PayPalButtons,
} from "@paypal/react-paypal-js";
import { getTempBookingByIdWithUserNSpaceRepo } from "@/repositories/temp-booking";
import { Row } from "postgres";
import { paymentSuccessAction } from "./action";

export default function PaymentSummaryPage() {
    const searchParams = useSearchParams();
    const preBookingId = searchParams.get("preBookingId");
    const [isLoading, setIsLoading] = useState(true);
    const [tempBooking, setTempBooking] = useState<Row | null>(null);
    const [space, setSpace] = useState<Row | null>(null);
    const [user, setUser] = useState<Row | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getTempBookingByIdWithUserNSpaceRepo(preBookingId as string).then((data) => {
            setTempBooking(data);
            setSpace(data.space);
            setUser(data.user);
            setIsLoading(false);
        });
    }, [preBookingId]);

    const router = useRouter();
    const spaceName = space?.name;
    const category = space?.category ?? "--";
    const date =
        tempBooking && tempBooking.date
            ? new Date(tempBooking.date).toLocaleDateString()
            : tempBooking?.date_start && tempBooking?.date_end
                ? `${new Date(tempBooking.date_start).toLocaleDateString()} - ${new Date(tempBooking.date_end).toLocaleDateString()}`
                : tempBooking?.month_start && tempBooking?.month_end
                    ? `${tempBooking.month_start} - ${tempBooking.month_end}`
                    : "--";
    const startTime = tempBooking?.start_time ? tempBooking.start_time.slice(0, 5) : "--";
    const endTime = tempBooking?.end_time ? tempBooking.end_time.slice(0, 5) : "--";
    const totalPrice = tempBooking ? parseFloat(tempBooking.total_price).toFixed(2) : "0.00";
    const bookingType = tempBooking?.type ?? "--";

    // Helper to build query string for booking details
    const buildSuccessUrl = (actions: any) => {
        setIsLoading(true);
        paymentSuccessAction(preBookingId as string, actions).then(() => {
            setIsLoading(false);
            router.push(`/user/success?preBookingId=${preBookingId}`);
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                Loading booking details...
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Payment Summary</h2>
            <div className="mb-6 flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Space</span>
                    <span className="font-medium">{spaceName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Booking Type</span>
                    <span className="font-medium capitalize">{bookingType}</span>
                </div>
                {bookingType === "hour" && (
                    <>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Start Time</span>
                            <span className="font-medium">{startTime}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">End Time</span>
                            <span className="font-medium">{endTime}</span>
                        </div>
                    </>
                )}
                {bookingType === "day" && (
                    <>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Total Days</span>
                            <span className="font-medium">{tempBooking?.duration ?? "--"}</span>
                        </div>
                    </>
                )}
                {bookingType === "month" && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Months</span>
                        <span className="font-medium">{tempBooking?.duration ?? "--"}</span>
                    </div>
                )}
            </div>
            <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>A${parseFloat(totalPrice).toFixed(2)}</span>
            </div>

            <PayPalScriptProvider
                // options={{
                //     clientId: "AQpxi8gzTkeEY7jxKS2f3L_FUPEYkSnNSoylO3GhMhHmcENQBcCzOJ2aGzWLgDSjv2pzo2p8EjWpPRKQ",
                //     currency: "AUD",
                //     intent: "capture",
                //     components: "buttons,funding-eligibility",
                // }}
                options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
                    currency: "AUD",
                    intent: "capture",
                    components: "buttons,funding-eligibility",
                }}
            >
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
                                    description: `${spaceName} booking (${category})`,
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (!actions?.order) return;
                        await actions.order.capture();
                        const orderDetails = await actions.order.capture();
                        buildSuccessUrl(orderDetails);
                    }}
                    onError={(err) => {
                        alert("Payment could not be completed. Please try again.");
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}
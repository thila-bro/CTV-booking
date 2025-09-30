'use server';

import fs from "fs";
import path from "path";
import { formatTime } from "./global";
import { bookingConfirmationEmailSubject } from "./constant";


export async function sendTestEmail2(data: any) {

    console.log("sendTestEmail2 data", data);

    // Read the template file
    const templatePath = path.join(process.cwd(), "lib/emailTemplates/bookingConfirm.html");
    let html = fs.readFileSync(templatePath, "utf8");

    // Example booking data
    const booking = {
        name: data.user.first_name + " " + data.user.last_name,
        spaceName: data.space.name,
        category: "hour", // or "day", "month"
        date: data.date ? new Date(data.date).toLocaleDateString() : "--",
        startTime: formatTime(data.start_time),
        endTime: formatTime(data.end_time),
        duration: "duration", // Placeholder for duration
        totalPrice: parseFloat(data.total_price || "0").toFixed(2)
    };

    html = html
        .replace("{{name}}", booking.name)
        .replace("{{spaceName}}", booking.spaceName)
        .replace("{{category}}", booking.category)
        .replace("{{date}}", booking.date)
        .replace("{{startTime}}", booking.startTime)
        .replace("{{endTime}}", booking.endTime)
        .replace("{{duration}}", booking.duration)
        .replace("{{totalPrice}}", booking.totalPrice)
        // Remove or show conditional blocks
        .replace(/{{#ifHour}}([\s\S]*?){{\/ifHour}}/g, booking.category === "hour" ? "$1" : "")
        .replace(/{{#ifDay}}([\s\S]*?){{\/ifDay}}/g, booking.category === "day" ? "$1" : "")
        .replace(/{{#ifMonth}}([\s\S]*?){{\/ifMonth}}/g, booking.category === "month" ? "$1" : "");


    const test = await sendEmail(
        "thilanmaduranga73@gmail.com",
        bookingConfirmationEmailSubject,
        "",
        html
    );
}







async function sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                text,
                html
            }),
        });

        const data = await response.json();
        if (data.success) {
            console.log('Email sent successfully!');
        } else {
            console.error('Failed to send email: ' + data.error);
        }
    } catch (error) {
        // alert('An error occurred: ' + error?.message);
        console.error('An error occurred:', error);
    }
}
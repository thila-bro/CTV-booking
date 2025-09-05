import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, type: 'user' | 'admin' ) {
    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

    switch (type) {
        case 'user':
            (await cookies()).set("UserSession", session, {
                // httpOnly: true,
                secure: false,
                expires: expiresAt,
                sameSite: "lax",
                path: "/",
            });
            break;
        case 'admin':
            (await cookies()).set("AdminSession", session, {
                // httpOnly: true,
                secure: false,
                expires: expiresAt,
                sameSite: "lax",
                path: "/",
            });
            break;
    }
    // (await cookies()).set("Session", session, {
    //     // httpOnly: true,
    //     secure: false,
    //     expires: expiresAt,
    //     sameSite: "lax",
    //     path: "/",
    // });
}


export async function deleteSession(type?: 'user' | 'admin') {
    try {
        switch (type) {
            case 'user':
                (await cookies()).delete("UserSession");
            case 'admin':
                (await cookies()).delete("AdminSession");
            // default:
            //     (await cookies()).delete("UserSession");
            //     (await cookies()).delete("AdminSession");
        }
    } catch (error) {
        console.log(error);
    }

    return;
}

type SessionPayload = {
    userId: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session");
    }
}
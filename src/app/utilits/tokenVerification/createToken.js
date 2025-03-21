import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

// Secure secret using environment variable
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "123-XYZ");

// Create a JWT token
export async function CreateToken(email, id) {
    const payload = { email, id };
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("localhost")
        .setExpirationTime("24h") // Fix expiration time
        .sign(secret);
    return token;
}

// Verify a JWT token
export async function veryfiToken(token) {
    const decoded = await jwtVerify(token, secret);
    return decoded["payload"];
}
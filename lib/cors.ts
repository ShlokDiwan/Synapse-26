import { NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'http://localhost:5173',           // Local development
    'http://localhost:3000',           // Local Next.js
    'https://synapseadmin.netlify.app', // Production admin panel (update as needed)
]

export function corsHeaders(origin?: string | null) {
    // Check if origin is allowed
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0]

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    }
}

export function handleCorsResponse(origin?: string | null) {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
    })
}

export function addCorsHeaders(response: NextResponse, origin?: string | null) {
    const headers = corsHeaders(origin)
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
    const data = await request.json()

    const res = await axios.post(`${NEXT_PUBLIC_API_URL}/users/company/register/`, data)

    const tokenData = res.data;

    return NextResponse.json(tokenData)
    // return NextResponse.json({ 'message': 'success' })
}
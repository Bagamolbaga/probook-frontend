/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    email:string
    password: string
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest, formData: any) {
  const data = await request.json() as Body
  const authData = {
    grant_type: "password",
    username: data.email,
    password: data.password,
    client_id: process.env.CLIENT_ID_BUSINESS,
    client_secret: process.env.CLIENT_SECRET_BUSINESS,
  };
  const res = await axios.post(`${NEXT_PUBLIC_API_URL}/o/token/`, authData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokenData = res.data;
  
  console.log({tokenData});

  return NextResponse.json(tokenData);
}

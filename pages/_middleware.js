import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export async function middleware(req) {
  // token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // allow requests if its true
  // 1. token exists
  // 2. its a request for next-auth session and provider fetch

  if(pathname.includes('api/auth') || token){
    return NextResponse.next();
  }

  // redirect to login if user not have token and request access to protected route
  if(!token && pathname !== '/login'){
    return NextResponse.redirect('/login');
  }
}
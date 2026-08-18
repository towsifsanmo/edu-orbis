import { NextResponse } from 'next/server';

export function middleware(request :any) {
  // ইউজারের ব্রাউজার থেকে কুকি রিড করা
  const authToken = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // ড্যাশবোর্ড রাউট প্রটেক্ট করা
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করা
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // যদি ইউজার আগে থেকেই লগইন করা থাকে, তাহলে লগইন পেজে গেলে সরাসরি ড্যাশবোর্ডে পাঠিয়ে দেওয়া
  if (pathname === '/login' && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// কোন কোন পাথে (path) মিডলওয়্যারটি কাজ করবে তা নির্ধারণ করা
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
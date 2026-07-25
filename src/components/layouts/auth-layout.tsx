import { useRouter } from 'next/router';
import Image from 'next/image';
import Logo from '@/components/ui/logo';
import React from 'react';

export default function AuthPageLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <div className="relative flex h-screen items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-background.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>
      
      {/* Content */}
      <div className="relative z-10 m-auto w-full max-w-[420px] rounded bg-light p-5 sm:p-8 sm:shadow backdrop-blur-sm bg-white/90">
        <div className="mb-2 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
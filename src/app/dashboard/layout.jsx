'use client'

import NavBar from "@/components/NavBar";
import React from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({children}) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === 'loading') {
    return <p>Loading ...</p>;
  }

  if (session.status === 'unauthenticated') {
    router?.push('/');
  }

  if (session.status === 'authenticated') {
    return (
      <div className="flex flex-col items-center">
        <div className="sticky top-0 z-50 flex flex-col items-center box-border w-full">
          <NavBar />
        </div>
        {children}
      </div>
    );
  }

  }
  
  export default DashboardLayout;
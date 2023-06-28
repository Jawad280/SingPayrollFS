'use client'
import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const NavBar = () => {

  const session = useSession();
  const companyName = session.data.user.name.companyName;

  if (session.data.user.name.isAdmin) {
    return (
      <div className='flex justify-between p-4 box-border w-full mb-6 items-center bg-white print:hidden border-b border-b-sky-100'>
        <div className='flex gap-6 items-center'>
          <div>
            <Link href="/dashboard/" className='text-cyan-800'>
              <Image src="/payroll.png" alt="Logo" height={125} width={125}/>
            </Link>
          </div>
          <div className='font-bold text-[18px]'>{companyName}</div>
        </div>

          <div className='flex gap-6 items-center'>
              <Link 
                href="/" 
                className=""
              >
                <div className='flex gap-2 bg-transparent border border-red-400 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white items-center text-red-500'>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>

                  <div onClick={signOut}>Signout</div>
                </div>
                
              </Link>
          </div>
      </div>      
    )
  }

  return (
    <div className='flex justify-between p-4 box-border w-full mb-6 items-center bg-white print:hidden border-b border-b-sky-100'>
      <div className='flex gap-6 items-center'>
          <div>
            <Link href="/dashboard/" className='text-cyan-800'>
              <Image src="/payroll.png" alt="Logo" height={125} width={125}/>
            </Link>
          </div>
        <div className='font-bold text-[18px]'>{companyName}</div>
      </div>

        <div className='flex gap-6 items-center'>
            <Link href="/dashboard/" className="hover:text-sky-300 text-cyan-800">CPF</Link>
            <Link href="/dashboard/payslip-list" className="hover:text-sky-300 text-cyan-800">Payslips</Link>
            <Link href="/dashboard/employee-list" className="hover:text-sky-300 text-cyan-800">Employee List</Link>
            <Link href="/dashboard/create-employee" className="hover:text-sky-300 text-cyan-800">Create Employee</Link>
            
            <Link 
              href="/" 
              className=""
            >
              <div className='flex gap-2 bg-transparent border border-red-400 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white items-center text-red-500'>
                
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>

                <div onClick={signOut}>Signout</div>
              </div>
              
            </Link>
        </div>
    </div>
  )
}

export default NavBar
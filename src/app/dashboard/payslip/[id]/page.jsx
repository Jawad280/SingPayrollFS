'use client'
import Payslip from '@/components/Payslip'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import EditPayslip from '@/components/EditPayslip';
import Image from 'next/image';

const IndividualPayslip = ({params}) => {

    const { back } = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const [edit, setEdit] = useState(false);
    const [dual, setDual] = useState(false);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/payslips/${params.id}`, fetcher);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }

  if (edit) {
    return (
      <div className='flex flex-col items-center relative box-border w-full'>
        <div className='border w-[21cm] h-[14.8cm] box-border' id='print-content'>
            <EditPayslip payslipData={data} setEdit={setEdit}/>
        </div>
      </div> 
    )
   
  }


  return (
    <div className='flex flex-col items-center relative box-border w-full'>
      <div className='border w-[21cm] h-[14.8cm] box-border' id='print-content'>
          <Payslip payslipData={data} />
      </div>

      <div 
        onClick={back}
        className="hover:bg-cyan-100 rounded-full p-4 flex items-center justify-center cursor-pointer absolute top-8 left-[250px]"
      >
        <Image src="/arrow-left-circle.svg" alt="back" width={30} height={30}/>
      </div>

      <div 
        onClick={() => window.print()}
        className="hover:bg-cyan-100 rounded-full p-4 flex items-center justify-center cursor-pointer absolute top-8 right-[250px]"
      >
        <Image src="/printer.svg" alt="print" width={30} height={30}/>
      </div>

      <div 
        onClick={() => setEdit(true)}
        className="hover:bg-cyan-100 rounded-full p-4 flex items-center justify-center cursor-pointer absolute top-32 right-[250px]"
      >
        <Image src="/edit-black.svg" alt="edit" width={30} height={30}/>
      </div>

    </div>

  )
}

export default IndividualPayslip
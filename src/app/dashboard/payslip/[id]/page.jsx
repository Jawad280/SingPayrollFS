'use client'
import Payslip from '@/components/Payslip'
import React from 'react'
import useSWR, { mutate } from 'swr';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

const IndividualPayslip = ({params}) => {

    const { back } = useRouter();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`/api/payslips/${params.id}`, fetcher);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }

  return (
    <div className='flex flex-col items-center relative box-border w-full'>
      <div className='border w-[21cm] h-[14.8cm] box-border' id='print-content'>
          <Payslip payslipData={data} />
      </div>


      <Button 
        onClick={back}
        className="absolute top-8 left-[250px]"
      >
        Go Back
      </Button>

      <Button 
        onClick={() => window.print()}
        className="absolute top-8 right-[250px]"
      >
        Print
      </Button>


    </div>

  )
}

export default IndividualPayslip
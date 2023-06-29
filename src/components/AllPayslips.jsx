'use client'
import React from 'react'
import useSWR from 'swr';
import Payslip from './Payslip';
import Loading from './Loading';

const AllPayslips = ({ monthYear, companyName }) => {

    // fetch payslips
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/payslips/company/${companyName}/monthYear/${monthYear}`, fetcher);

    if (isLoading) {
      return (
        <div>
          <Loading />
        </div> 
        );
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

  return (
    <div className='flex flex-col items-center'>
      {data.map((x) => (
        <div className='flex flex-col items-center w-[21cm] h-[14.8cm] bg-white border' key={x.id} id='print-content'>
          <Payslip payslipData={x} />
        </div>
      ))}
    </div>

  )
}

export default AllPayslips
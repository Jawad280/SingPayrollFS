'use client'
import React, { useState } from 'react'
import { Table, Button } from 'flowbite-react';
import useSWR from 'swr';
import Link from 'next/link';
import AllPayslips from '@/components/AllPayslips';
import { useSession } from 'next-auth/react';

const PayslipListOfMonthYear = ({params}) => {

    const session = useSession();
    const companyName = session.data.user.name.companyName;
    const monthYear = params.monthYear;
    const [clicked, setClicked] = useState(false);

  // fetch employees
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`http://localhost:3000/api/payslips/company/${companyName}/monthYear/${monthYear}`, fetcher);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const test = data[0];

    const grossPay = (x) => {
        const a = Number(x.basicPay)+Number(x.allowance);
        return twoDecimal(a).toString();
    }

    const netPayGen = (x) => {
        const c = Number(x.basicPay)+Number(x.allowance);
        const d = parseFloat(x.employeeShare.replace(/[$,]/g, "")).toFixed(2);
        const e = Number(x.otPay);
        const f = Number(x.additionalPay);
        const netPay = c-d+e+f;
        return twoDecimal(netPay);
    }

    const netPayGenForeigner = (x) => {
        const c = twoDecimal(Number(x.basicPay)+Number(x.allowance));
        const e = Number(twoDecimal(x.otPay));
        const f = Number(twoDecimal(x.additionalPay));
        const netPay = c+e+f;
        return twoDecimal(netPay);
    }

    const twoDecimal = (x) => {
        return parseFloat(x).toFixed(2);
    }


    if (clicked) {
        return (
            <div className="box-border w-full relative">
                <AllPayslips monthYear={monthYear} companyName={companyName}/>
                
                <Button 
                    onClick={() => setClicked(false)}
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

  return (
    <div className="box-border w-4/5 flex flex-col items-center gap-10">
        <Table>
            <Table.Head>
                <Table.HeadCell>
                    S/N
                </Table.HeadCell>

                <Table.HeadCell>
                    Employee Name
                </Table.HeadCell>

                <Table.HeadCell>
                    NRIC
                </Table.HeadCell>

                <Table.HeadCell>
                    Date Of Birth
                </Table.HeadCell>

                <Table.HeadCell>
                    Designation
                </Table.HeadCell>

                <Table.HeadCell>
                    Gross Pay
                </Table.HeadCell>

                <Table.HeadCell>
                    Employee Contribution
                </Table.HeadCell>

                <Table.HeadCell>
                    Employer Contribution
                </Table.HeadCell>

                <Table.HeadCell>
                    <span className="sr-only">
                    View
                    </span>
                </Table.HeadCell>

            </Table.Head>


            <Table.Body className="divide-y">
                {data.map((test, index) => (
                <Table.Row key={index+1} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{index+1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{test.employeeName}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{test.NRIC}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{new Date(test.dateOfBirth).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{test.designation}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">${grossPay(test)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{test.employeeShare}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{test.employerShare}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <Link href={`/dashboard/payslip/${test.id}`}>
                            View
                        </Link>
                    </Table.Cell>
                </Table.Row>
                ))}


            </Table.Body>
        </Table>

        <Button onClick={() => setClicked(true)}> View All </Button>
    </div>
  )
}

export default PayslipListOfMonthYear
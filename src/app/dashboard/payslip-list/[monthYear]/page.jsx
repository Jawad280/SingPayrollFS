'use client'
import React, { useState } from 'react'
import { Table, Button } from 'flowbite-react';
import useSWR from 'swr';
import Link from 'next/link';
import AllPayslips from '@/components/AllPayslips';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Loading from '@/components/Loading';

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx';

const PayslipListOfMonthYear = ({params}) => {

    const session = useSession();
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const companyName = session.data.user.name.companyName;
    const monthYear = params.monthYear;
    const [clicked, setClicked] = useState(false);

  // fetch employees
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

  const final = data.map((x) => x.isFinal).every((isFinal) => isFinal === true);


  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
  
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById('payslip-table'));
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee List');
  
    const xlFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    saveAs(new Blob([xlFile]), `payslip-${monthYear.replace("%20", "-")}.xlsx`);
  }

  const handleFinalise = async () => {
    console.log("Finalise has begun ....")
    data.map((payslip) => {

        const updatedPayslip = {
            contributionMonthYear: payslip.contributionMonthYear,
            dateOfPayment: payslip.dateOfPayment,
            dateOfBirth: payslip.dateOfBirth,
            isFinal: true
        }

        const send = fetch(`${apiUrl}/api/payslips/${payslip.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayslip)
            
          });
          console.log(updatedPayslip)

          if (send.ok) {
            console.log("Payslip Finalised");
          }
    })
  }

  const handleUnfinalise = async () => {
    console.log("Unfinalise has begun ....")
    data.map((payslip) => {

        const updatedPayslip = {
            contributionMonthYear: payslip.contributionMonthYear,
            dateOfPayment: payslip.dateOfPayment,
            dateOfBirth: payslip.dateOfBirth,
            isFinal: false
        }

        const send = fetch(`${apiUrl}/api/payslips/${payslip.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayslip)
          });

          if (send.ok) {
            console.log("Payslip Finalised");
          }
    })
  }

    const grossPay = (x) => {
        const a = Number(x.basicPay)+Number(x.allowance);
        return twoDecimal(a).toString();
    }

    const calculateDeduction = (empShare, otherDed) => {
        // Removing commas from the string values
        const employeeShareString = empShare.replace("$", "").replace(/,/g, "");
        const otherDeductionString = otherDed === null ? "0" : otherDed.replace(/,/g, "");
      
        // Extracting the numeric values from the strings
        const employeeShareValue = parseFloat(employeeShareString);
        const otherDeductionValue = parseFloat(otherDeductionString);
      
        // Calculating the total deductions
        const totalDeductions = employeeShareValue + otherDeductionValue;
      
        // Formatting the total deductions as a string in the format "$..."
        return "$" + totalDeductions.toFixed(2);
      };

    const netPayGen = (payslipData) => {
        const c = Number(payslipData.basicPay)+Number(payslipData.allowance);
        const totalDeduction = calculateDeduction((payslipData.citizenshipStatus === "" ? "$0.00" : payslipData.employeeShare), payslipData.otherDeduction)
        const d = Number(parseFloat(totalDeduction.replace(/[$,]/g, "")));
        const e = Number(payslipData.otPay);
        const f = Number(payslipData.additionalPay);
        const netPay = c-d+e+f;
        return twoDecimal(netPay);
    }


    const twoDecimal = (x) => {
        return parseFloat(x).toFixed(2);
    }

    const totalCPF = (ps) => {
        const a = ps.citizenshipStatus === "" ? "0.00" : parseFloat(ps.employeeShare.replace(/[$,]/g, "")).toFixed(2);
        const b = ps.citizenshipStatus === "" ? "0.00" : parseFloat(ps.employerShare.replace(/[$,]/g, "")).toFixed(2);
        const result = Number(a) + Number(b);
        return twoDecimal(result)
    }

    const sortedPayslips = data?.sort((a, b) => a.employeeName.localeCompare(b.employeeName));


    if (clicked) {
        return (
            <div className="box-border w-full relative">
                <AllPayslips monthYear={monthYear} companyName={companyName}/>
                
                <div 
                    onClick={() => setClicked(false)}
                    className="hover:bg-cyan-100 rounded-full p-4 flex items-center justify-center cursor-pointer absolute top-8 left-[250px]"
                >
                    <Image src="/arrow-left-circle.svg" alt="print" width={30} height={30}/>
                </div>

                <div 
                    onClick={() => window.print()}
                    className="hover:bg-cyan-100 rounded-full p-4 flex items-center justify-center cursor-pointer absolute top-8 right-[250px]"
                >
                    <Image src="/printer.svg" alt="print" width={30} height={30}/>
                </div>
            </div>
        )
    }

  return (
    <div className="box-border w-full flex flex-col items-center gap-10">
        {final && (
            <div className="font-bold text-red-600">
                This month inputs have been finalised 
            </div>
        )}
        <div className='text-lg font-bold'>CPF Summary of {monthYear.replace("%20", " ")}</div>
        <Table id='payslip-table'>
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
                    Designation
                </Table.HeadCell>

                <Table.HeadCell>
                    Total CPF
                </Table.HeadCell>

                <Table.HeadCell>
                    Employer CPF
                </Table.HeadCell>

                <Table.HeadCell>
                    Employee CPF
                </Table.HeadCell>

                <Table.HeadCell>
                    Gross Pay
                </Table.HeadCell>

                <Table.HeadCell>
                    Net Pay
                </Table.HeadCell>

                <Table.HeadCell>
                    <span className="sr-only">
                    View
                    </span>
                </Table.HeadCell>

            </Table.Head>


            <Table.Body className="divide-y">
                {sortedPayslips.map((test, index) => (
                <Table.Row key={index+1} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{index+1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{test.employeeName}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{test.NRIC}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{test.designation}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">${totalCPF(test)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{test.employerShare === null ? "$0.00" : test.employerShare}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">{test.employeeShare === null ? "$0.00" : test.employeeShare}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">${grossPay(test)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">${netPayGen(test)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-sm text-gray-900 dark:text-white">
                        <Link href={`/dashboard/payslip/${test.id}`}>
                            <Image src="/pencil-square.svg" alt="Edit" height={16} width={16} />
                        </Link>
                    </Table.Cell>
                </Table.Row>
                ))}

            </Table.Body>
        </Table>

        <div className='flex gap-6 justify-center'>
            <Button onClick={() => setClicked(true)}> View All </Button>
            <Button onClick={handleDownload}> Download </Button>
            <Button onClick={handleFinalise} className="bg-red-600 hover:bg-red-500">Finalise</Button>
            <Button onClick={handleUnfinalise} className="bg-indigo-600 hover:bg-indigo-500">Un-finalise</Button>
        </div>

    </div>
  )
}

export default PayslipListOfMonthYear
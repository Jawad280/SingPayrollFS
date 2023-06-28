'use client'
import React, { useState } from 'react'
import { Button } from 'flowbite-react';
import Image from 'next/image';

const EditPayslip = ({payslipData, setEdit}) => {

    const fromToDate = (date) => {
        const paymentDate = new Date(date);
      
        const year = paymentDate.getFullYear();
        const month = paymentDate.getMonth();
      
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
      
        const formattedFirstDay = firstDayOfMonth.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      
        const formattedLastDay = lastDayOfMonth.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      
        const formattedDate = `${formattedFirstDay} - ${formattedLastDay}`;
        return formattedDate;
    };

    const formatDate = (date) => {
        const paymentDate = new Date(date);

        const formattedDate = paymentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

        return formattedDate;
    }

    const grossPay = () => {
        const a = Number(payslipData.basicPay)+Number(payslipData.allowance);
        return twoDecimal(a).toString();
    }

    const netPayGen = () => {
        const c = Number(payslipData.basicPay)+Number(payslipData.allowance);
        const d = parseFloat(payslipData.employeeShare.replace(/[$,]/g, "")).toFixed(2);
        const e = Number(payslipData.otPay);
        const f = Number(payslipData.additionalPay);
        const netPay = c-d+e+f;
        return twoDecimal(netPay);
    }

    const netPayGenForeigner = () => {
        const c = Number(twoDecimal(payslipData.basicPay)) + Number(twoDecimal(payslipData.allowance));
        const e = Number(twoDecimal(payslipData.otPay));
        const f = Number(twoDecimal(payslipData.additionalPay));
        const netPay = c+e+f;
        return twoDecimal(netPay);
    }

    const twoDecimal = (x) => {
        return parseFloat(x).toFixed(2);
    }

    const [other, setOther] = useState(payslipData.other || '');
    const [np, setNp] = useState(payslipData.netPay || (payslipData.citizenshipStatus === "" ? netPayGenForeigner() : netPayGen()))
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const handleSave = async (e) => {
        e.preventDefault()

        const updatedPayslip = { 
            other: other, 
            netPay: np,
            contributionMonthYear: payslipData.contributionMonthYear,
            dateOfPayment: payslipData.dateOfPayment,
            dateOfBirth:payslipData.dateOfBirth 
        }

        fetch(`${apiUrl}/api/payslips/${payslipData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayslip),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Payslip updated successfully: ", data);
        })
        .catch(error => {
            console.error("Error updating: ", error);
        })
        .then(() => {
            setEdit(false);
        })
    }

  return (
    <div className='flex flex-col items-center gap-8'>
        <div className="h-[14.85cm] w-full flex items-center py-12 box-border">
            <div className='flex flex-col gap-5 h-full w-[10.5cm] pl-12 pr-2'>
                <div className="font-bold text-[24px] h-[45px]">
                    Itemised Payslip
                </div>
                <div className='flex flex-col'>
                    <div className="font-semibold text-[14px]">Name of Employer</div>
                    <div className='text-[12px]'>{payslipData.companyName}</div>
                </div>
                <div className='flex flex-col'>
                    <div className="font-semibold text-[14px]">Name of Employee</div>
                    <div className='text-[12px]'>{payslipData.employeeName}</div>
                </div>
                <table className="border border-gray-400 rounded-lg text-[12px]">
                    <thead className='border-b border-gray-400'>
                        <tr>
                            <th className="p-2 border-r border-gray-400 ">Item</th>
                            <th className="p-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Basic Pay</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>${payslipData.basicPay}</div>
                                    <div className='flex-none w-[30px] p-2'>(A)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Total Allowances</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>${payslipData.allowance}</div>
                                    <div className='flex-none w-[30px] p-2'>(B)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Gross Pay (A+B)</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>${grossPay()}</div>
                                    <div className='flex-none w-[30px] p-2'>(C)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Total Deductions (Employee CPF)</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>{payslipData.citizenshipStatus === "" ? "$0.00" : payslipData.employeeShare}</div>
                                    <div className='flex-none w-[30px] p-2'>(D)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-0" colSpan="2">
                                <input
                                placeholder="Enter Here"
                                type="text"
                                value={other}
                                onChange={(e) => setOther(e.target.value)}
                                className="w-full text-[12px] p-2 m-0 focus:outline-none border-none outline-none"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='flex flex-col gap-5 h-full w-[10.5cm] pl-2 pr-12'>
                <div className='flex flex-col items-start h-[45px]'>
                    <div className='font-semibold text-[14px]'>For the Period</div>
                    <div className='text-[12px]'>{fromToDate(payslipData.contributionMonthYear)}</div>
                </div>
                <div className='flex items-center'>
                    <div className='flex flex-col items-start flex-1'>
                        <div className='font-semibold text-[14px]'>Date of Payment</div>
                        <div className='text-[12px]'>{formatDate(payslipData.dateOfPayment)}</div>
                    </div>
                    <div className='flex flex-col items-start flex-1'>
                        <div className='font-semibold text-[14px]'>Mode of Payment</div>
                        <div className='text-[12px]'>{payslipData.modeOfPayment}</div>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='flex flex-col items-start flex-1'>
                        <div className='font-semibold text-[14px]'>NRIC/FIN</div>
                        <div className='text-[12px]'>{payslipData.NRIC}</div>
                    </div>
                    <div className='flex flex-col items-start flex-1'>
                        <div className='font-semibold text-[14px]'>Designation</div>
                        <div className='text-[12px]'>{payslipData.designation}</div>
                    </div>
                </div>
                <table className="border border-gray-400 rounded-lg text-[12px]">
                    <thead className='border-b border-gray-400'>
                        <tr>
                            <th className="p-2 border-r border-gray-400">Item</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Overtime Hours</td>
                            <td className='text-right p-2'>
                                {payslipData.otHours} hours
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Overtime Pay</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>${payslipData.otPay}</div>
                                    <div className='flex-none w-[30px] p-2'>(E)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Additional Payments</td>
                            <td className='p-0'>
                                <div className='flex'>
                                    <div className='flex-1 text-right p-2 border-r border-gray-400'>${payslipData.additionalPay}</div>
                                    <div className='flex-none w-[30px] p-2'>(F)</div>
                                </div>
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Net Pay (C-D+E+F)</td>
                            <td className='text-right p-0 font-bold'>
                                <input
                                    type="text"
                                    value={np}
                                    onChange={(e) => setNp(e.target.value)}
                                    className="text-[12px] p-2 focus:outline-0 border-0 text-right"
                                />
                            </td>
                        </tr>
                        <tr className='border-b border-gray-400'>
                            <td className="p-2 border-r border-gray-400">Employer&apos;s CPF Contribution</td>
                            <td className='text-right p-2'>
                                {payslipData.citizenshipStatus === "" ? "$0.00" : payslipData.employerShare}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Button onClick={handleSave}>
            Save
            </Button>

        <div className="hover:bg-rose-100 rounded-full p-4 flex items-center justify-center cursor-pointer" onClick={() => setEdit(false)}>
            <Image src="/x-circle.svg" alt="Cancel" width={30} height={30}/>
        </div>

    </div>
  )
}

export default EditPayslip
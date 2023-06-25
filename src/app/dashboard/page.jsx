'use client'
import React, { useState } from 'react'
import useSWR from 'swr';
import { Button, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminPage from '@/components/AdminPage';
import RegisterPage from '@/components/RegisterPage';

const Dashboard = () => {

  const session = useSession();
  const companyName = session.data.user.name.companyName;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const { push } = useRouter();

  const [cmy, setCmy] = useState('');
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [clicked, setClicked] = useState(false);

  // // fetch employees
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(apiUrl + `/api/employees/companyName/${companyName}`, fetcher);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (session.data.user.name.isAdmin) {

    if (clicked) {
      return (
        <div>
          <RegisterPage setClicked={setClicked}/>
        </div>
      )
    }

    return (
      <div className="flex flex-col justify-between items-center box-border w-full gap-8 p-6">
        
        <Button onClick={() => setClicked(true)} className='bg-sky-700 hover:bg-sky-600'>
          Create New Company Account
        </Button>

        <div>
          <AdminPage/>
        </div>
        

      </div>
      
    )
  }

  const employeeList = data;

  const getCPF = async (employee, cmy) => {
    try {
      console.log("CPF is being generated ..............")
      const res = await fetch(apiUrl + '/api/extract/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({employee, cmy}),
      });

      const data = await res.json(); // Parse the response as JSON
      console.log(data);
      return data;

    } catch (error) {
        console.log(error);
    }
  };

  const makePayslip = async (employeeShare, employerShare, employee, contributionMonthYear) => {
      const newPayslip = {
          name: formatMonthYear(contributionMonthYear),
          employeeRef: employee.id,
          contributionMonthYear: contributionMonthYear,
          dateOfPayment: dateOfPayment,
          employeeName: employee.name,
          dateOfBirth: employee.dateOfBirth,
          citizenshipStatus: employee.citizenshipStatus,
          NRIC: employee.NRIC,
          basicPay: parseFloat(employee.basicPay).toFixed(2),
          allowance: parseFloat(employee.allowance).toFixed(2),
          additionalPay: parseFloat(employee.additionalPay).toFixed(2),
          otPay: parseFloat(employee.otPay).toFixed(2),
          otHours: employee.otHours,
          modeOfPayment: employee.modeOfPayment,
          isResigned: employee.isResigned,
          employeeShare: employeeShare,
          employerShare: employerShare,
          designation: employee.designation,
          companyName: companyName
      }

      try {
          const res = await fetch(apiUrl + '/api/payslips/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newPayslip),
          });
          console.log(res);
      } catch(error) {
          console.log(error);
      }
  }

  const checker = async (employeeShare, employerShare, employee, contributionMonthYear) => {

    const name = formatMonthYear(contributionMonthYear);
    const NRIC = employee.NRIC;
    console.log("Checker activated", name, NRIC);

    const res = await fetch(apiUrl + `/api/payslips/name/${name}/${NRIC}`);
    const data = await res.json();
    console.log(data);
    
    if (data) {
      const updatedPayslip = {
        name: data.name,
        employeeRef: data.employeeRef,
        contributionMonthYear: contributionMonthYear,
        dateOfPayment: dateOfPayment,
        employeeName: data.employeeName,
        dateOfBirth: data.dateOfBirth,
        citizenshipStatus: data.citizenshipStatus,
        NRIC: data.NRIC,
        basicPay: parseFloat(data.basicPay).toFixed(2),
        allowance: parseFloat(data.allowance).toFixed(2),
        additionalPay: parseFloat(data.additionalPay).toFixed(2),
        otPay: parseFloat(data.otPay).toFixed(2),
        otHours: data.otHours,
        modeOfPayment: data.modeOfPayment,
        isResigned: data.isResigned,
        employeeShare: employeeShare,
        employerShare: employerShare,
        designation: data.designation
      }
  
      const send = await fetch(apiUrl + `/api/payslips/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayslip)
      });
  
      if (send.ok) {
        console.log("Payslip Updated");
      }
    } else {
      return makePayslip(employeeShare, employerShare, employee, contributionMonthYear);
    }

  }

  const foreignPayslip = async (employee, contributionMonthYear) => {
    const newPayslip = {
      name: formatMonthYear(contributionMonthYear),
      employeeRef: employee.id,
      contributionMonthYear: contributionMonthYear,
      dateOfPayment: dateOfPayment,
      employeeName: employee.name,
      dateOfBirth: employee.dateOfBirth,
      citizenshipStatus: employee.citizenshipStatus,
      NRIC: employee.NRIC,
      basicPay: parseFloat(employee.basicPay).toFixed(2),
      allowance: parseFloat(employee.allowance).toFixed(2),
      additionalPay: parseFloat(employee.additionalPay).toFixed(2),
      otPay: parseFloat(employee.otPay).toFixed(2),
      otHours: employee.otHours,
      modeOfPayment: employee.modeOfPayment,
      isResigned: employee.isResigned,
      designation: employee.designation,
      companyName: companyName
    }

    try {
      const res = await fetch(apiUrl + '/api/payslips/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPayslip),
      });
    } catch(error) {
        console.log(error);
    }
  }
  
  const foreignChecker = async (employee, contributionMonthYear) => {
    const name = formatMonthYear(contributionMonthYear);
    const NRIC = employee.NRIC;

    const res = await fetch(apiUrl + `/api/payslips/name/${name}/${NRIC}`);
    const data = await res.json();

    if (data) {
      const updatedPayslip = {
        name: data.name,
        employeeRef: data.employeeRef,
        contributionMonthYear: contributionMonthYear,
        dateOfPayment: dateOfPayment,
        employeeName: data.employeeName,
        dateOfBirth: data.dateOfBirth,
        citizenshipStatus: data.citizenshipStatus,
        NRIC: data.NRIC,
        basicPay: parseFloat(data.basicPay).toFixed(2),
        allowance: parseFloat(data.allowance).toFixed(2),
        additionalPay: parseFloat(data.additionalPay).toFixed(2),
        otPay: parseFloat(data.otPay).toFixed(2),
        otHours: data.otHours,
        modeOfPayment: data.modeOfPayment,
        isResigned: data.isResigned,
        designation: data.designation,
        companyName: companyName
      }
  
      const send = await fetch(apiUrl + `/api/payslips/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayslip)
      });
  
      if (send.ok) {
        console.log("Payslip Updated");
      }
    } else {
      return foreignPayslip(employee, contributionMonthYear);
    }
  }

  function formatMonthYear(date) {
    const dateObject = new Date(date);
    const options = { month: 'long', year: 'numeric' };
    return dateObject.toLocaleDateString('en-US', options);
  }

  function helpNav(date) {
    const [year, month] = date.split('-');
    const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long' });
    const nav = monthName + " " + year;
    return `${nav}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({cmy, dateOfPayment});

    Promise.all(employeeList.map(async (x, i) => {
      if (!x.isResigned) {
        
        if (x.nationality != "Foreigner") {
          await getCPF(x, cmy)
          .then((CPFvalues) => {
            const employeeShare = CPFvalues[1];
            const employerShare = CPFvalues[2];
            return { employeeShare, employerShare }
          })
          .then(({ employeeShare, employerShare }) => {
            console.log("Payslip is being generated ..............")
            checker(employeeShare, employerShare, x, cmy);
          })
          // .finally(() => {
          //   console.log(employeeList.length, i);

          //   if (employeeList.length === i+1) {
          //     setIsFetched(true);
          //   }
          // })

        } else {

          await foreignChecker(x,cmy)
          // .then(() => {
          //   // push(`/dashboard/payslip-list/${nav}`)
          //   payslipList.push(`/dashboard/payslip-list/${nav}`)
          // // })
          // .finally(() => {
          //   console.log(employeeList.length, i);

          //   if (employeeList.length === i+1) {
          //     setIsFetched(true);
          //   }
          // })
        }  

      } else {
        console.log("This employee is resigned : " + x.name);
      }
    }))
    .then(() => {
      const nav = helpNav(cmy);
      push(`/dashboard/payslip-list/${nav}`);
    })


  }

  return (
    <div className="box-border w-full flex flex-col items-center">
      {console.log(session.data.user)}

      <form className='flex flex-col gap-8 bg-indigo-100 shadow-lg p-6 rounded-lg w-1/5' onSubmit={handleSubmit}>

        <div className='flex flex-col gap-4'>
          <div className="text-sm font-bold">
              Contribution Month
          </div>
          <TextInput
              type='date'
              value={cmy}
              onChange={(e) => setCmy(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-4'>
          <div className="text-sm font-bold">
              Date of Payment
          </div>
          <TextInput
              type='date'
              value={dateOfPayment}
              onChange={(e) => setDateOfPayment(e.target.value)}
          />
        </div>

        <Button type='submit' className="bg-sky-700 hover:bg-sky-600">Generate</Button>

      </form>
    </div>
  )
}

export default Dashboard
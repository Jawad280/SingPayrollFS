'use client'
import React, { useState } from 'react'
import useSWR from 'swr';
import { Button, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminPage from '@/components/AdminPage';
import RegisterPage from '@/components/RegisterPage';
import Loading from '@/components/Loading';
import PopupMonth from '@/components/PopupMonth';

const Dashboard = () => {

  const session = useSession();
  const companyName = session.data.user.name.companyName;

  const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;


  const { push } = useRouter();

  const [cmy, setCmy] = useState(new Date());
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [clicked, setClicked] = useState(false);
  const [wait, setWait] = useState(false);

  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(true);

  // // fetch employees
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`${apiUrl}/api/employees/companyName/${companyName}`, fetcher);

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

  // `${apiUrl}/api/extract/`
  // https://singpayroll-cpf.onrender.com/api/extract

  const getCPF = async (employee, cmy) => {
    try {
      console.log("CPF is being generated ..............")
      const res = await fetch(`${apiUrl}/api/extract/`, {
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
          const res = await fetch(`${apiUrl}/api/payslips/`, {
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
    
    const res = await fetch(`${apiUrl}/api/payslips/name/${name}/${NRIC}`);
    const data = await res.json();
    console.log(data);
    
    if (data) {
      if (data.isFinal) {
        alert("Payslips have been finalised for the chosen month, no more edits can occur !")
        console.log("Payslips have been finalised, no more edits can occur !")
      } else {
          const updatedPayslip = {
            name: data.name,
            employeeRef: data.employeeRef,
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
            designation: employee.designation
          }
      
          const send = await fetch(`${apiUrl}/api/payslips/${data.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPayslip)
          });
      
          if (send.ok) {
            console.log("Payslip Updated");
          }
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
      const res = await fetch(`${apiUrl}/api/payslips/`, {
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

    const res = await fetch(`${apiUrl}/api/payslips/name/${name}/${NRIC}`);
    const data = await res.json();

    if (data) {

      if (data.isFinal) {
        console.log("Payslips have been finalised, no more edits can occur !")
      } else {
        const updatedPayslip = {
          name: data.name,
          employeeRef: data.employeeRef,
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
    
        const send = await fetch(`${apiUrl}/api/payslips/${data.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPayslip)
        });
    
        if (send.ok) {
          console.log("Payslip Updated");
        }
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

  if (wait) {
    return (
      <div>
        <Loading />
      </div> 
    )
  }

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   console.log("Cmy and Date of Payment : " , cmy, dateOfPayment);

  //   const batches = chunkArray(employeeList, 10);

  //   for(const batch of batches) {
  //     setWait(true);

  //     try {
  //       await Promise.all(batch.map(async (x) => {
  //         if (!x?.isResigned) {
            
  //           if (x?.nationality != "Foreigner") {
  //             console.log(x)
  //             setWait(true)
  //             await getCPF(x, cmy)
  //             .then((CPFvalues) => {
  //               const employeeShare = CPFvalues[1];
  //               const employerShare = CPFvalues[2];
  //               return { employeeShare, employerShare }
  //             })
  //             .then(({ employeeShare, employerShare }) => {
  //               console.log("Payslip is being generated ..............")
  //               checker(employeeShare, employerShare, x, cmy);
  //             })
  //           } else {
  //             await foreignChecker(x,cmy)
  //           }  
    
  //         } else {
  //           console.log("This employee is resigned : " + x.name);
  //         }
  //       }));
  //       const nav = helpNav(cmy);
  //       setWait(false);
  //       push(`/dashboard/payslip-list/${nav}`);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Cmy and Date of Payment:", cmy, dateOfPayment);
  
    const batches = chunkArray(employeeList, 10);
  
    try {
      setWait(true);
  
      for (const batch of batches) {
        await Promise.all(
          batch.map(async (x) => {
            if (!x?.isResigned) {
              if (x?.nationality !== "Foreigner") {
                console.log(x);
                const CPFvalues = await getCPF(x, cmy);
                const employeeShare = CPFvalues[1];
                const employerShare = CPFvalues[2];
                console.log("Payslip is being generated..............");
                checker(employeeShare, employerShare, x, cmy);
              } else {
                await foreignChecker(x, cmy);
              }
            } else {
              console.log("This employee is resigned: " + x.name);
            }
          })
        );
      }
  
      const nav = helpNav(cmy);
      setWait(false);
      push(`/dashboard/payslip-list/${nav}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (open) {
    return (
      <PopupMonth label="Are you sure you want to choose an earlier date ?" setOpen={setOpen} fn={setOk}/>
    )
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
              type='month'
              value={cmy}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                const selectedYear = parseInt(year);
                const selectedMonth = parseInt(month);
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
          
                if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
                  setOpen(true);
                } 

                if (ok) {
                  setCmy(e.target.value);
                }
                
              }}
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
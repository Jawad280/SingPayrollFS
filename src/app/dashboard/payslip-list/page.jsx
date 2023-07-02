'use client'
import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Month from '@/components/Month';

const PayslipList = () => {
  const session = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const companyName = session.data.user.name.companyName;
  
  const { push } = useRouter();

  const months = [
    {value: 'January', label: 'January'},
    {value: 'February', label: 'February'},
    {value: 'March', label: 'March'},
    {value: 'April', label: 'April'},
    {value: 'May', label: 'May'},
    {value: 'June', label: 'June'},
    {value: 'July', label: 'July'},
    {value: 'August', label: 'August'},
    {value: 'September', label: 'September'},
    {value: 'October', label: 'October'},
    {value: 'November', label: 'November'},
    {value: 'December', label: 'December'}
  ];

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleYearChange = (e) => {
    const yearValue = e.target.value;

    if (yearValue.length <= 4) {
      setSelectedYear(e.target.value)
    } else {
      alert('Invalid Year !');
    }
    
  };

  const handleClick = () => {
    const monthYear = selectedMonth.value + " " + selectedYear;

    push(`/dashboard/payslip-list/${monthYear}`);
  }

  return (
    <div className='flex gap-8 items-center justify-center box-border w-full'>
      <div>
        <Month companyName={companyName}/>
      </div>
      <div className="bg-indigo-100 p-6 rounded-lg flex flex-col items-center box-border w-1/5 gap-8">
        <Select
          options={months}
          value={selectedMonth}
          onChange={setSelectedMonth}
          placeholder="Choose Month"
          isSearchable={false}
          required
          className="box-border w-full text-sm"
        />
        <div className="box-border w-full">
            <TextInput
              placeholder="Enter Year"
              required
              type="text"
              value={selectedYear}
              onChange={handleYearChange}
              className="box-border w-full text-sm"
            />
        </div>
        <Button onClick={handleClick} className="bg-sky-700 hover:bg-sky-600"> Retrieve </Button>
      </div>
    </div>
  )
}

export default PayslipList
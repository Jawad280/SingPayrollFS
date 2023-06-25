'use client'
import React, { useState } from 'react';
import Select from 'react-select';
import { Button, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';

const PayslipList = () => {
  
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
    {value: 'December', label: 'January'}
  ];

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleClick = () => {
    const monthYear = selectedMonth.value + " " + selectedYear;

    push(`/dashboard/payslip-list/${monthYear}`);
  }

  return (
    <div className="bg-indigo-100 p-6 rounded-lg flex flex-col items-center box-border w-2/5 gap-8">
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
            onChange={(e) => setSelectedYear(e.target.value)}
            className="box-border w-full text-sm"
          />
      </div>  

      <Button onClick={handleClick} className="bg-sky-700 hover:bg-sky-600"> Retrieve </Button>

  </div>
  )
}

export default PayslipList
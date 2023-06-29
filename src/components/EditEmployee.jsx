'use client'
import React, { useState, useEffect } from 'react'
import { Button, Label, TextInput, Radio } from 'flowbite-react';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

const EditEmployee = ({employeeId}) => {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const [name, setName] = useState('');
    const [NRIC, setNRIC] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [basicPay, setBasicPay] = useState('');
    const [allowance, setAllowance] = useState('');
    const [additionalPay, setAdditionalPay] = useState('');
    const [otHours, setOtHours] = useState('');
    const [otPay, setOtPay] = useState('');

    const [joinDate, setJoinDate] = useState('');
    const [designation, setDesignation] = useState('');
    const [resignDate, setResignDate] = useState('');

    const { push } = useRouter();

    // fetch employee
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/employees/${employeeId}`, fetcher);
    
    const [ nationality, setNationality ] = useState(data?.nationality);
    const [citizenshipStatus, setCitizenshipStatus] = useState(data?.citizenshipStatus);
    const [typeOfContribution, setTypeOfContribution] = useState(data?.typeOfContribution);
    const [modeOfPayment, setModeOfPayment] = useState(data?.modeOfPayment);
    const [isResigned, setIsResigned] = useState(data?.isResigned);
    const [showResignation, setShowResignation] = useState(isResigned);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const capturedName = name || data.name;
        const capturedNRIC = NRIC || data.NRIC;
        const capturedDateOfBirth = dateOfBirth || data.dateOfBirth;
        const capturedCitizenshipStatus = citizenshipStatus || data.citizenshipStatus;
        const capturedBasicPay = basicPay || data.basicPay;
        const capturedAllowance = allowance || data.allowance;
        const capturedAdditionalPay = additionalPay || data.additionalPay;
        const capturedOtHours = otHours || data.otHours;
        const capturedOtPay = otPay || data.otPay;
        const capturedModeOfPayment = modeOfPayment || data.modeOfPayment;
        const capturedResigned = isResigned || data.isResigned;
        const capturedNationality = nationality || data.nationality;
        const capturedTypeOfContribution = typeOfContribution || data.typeOfContribution;
        const capturedJoinDate = joinDate || data.joinDate;
        const capturedDesignation = designation || data.designation;
        const capturedResignDate = resignDate || data.resignDate;

        const updatedEmployee = {
            name: capturedName,
            NRIC: capturedNRIC,
            dateOfBirth: capturedDateOfBirth,
            citizenshipStatus: capturedCitizenshipStatus,
            basicPay: parseFloat(capturedBasicPay).toFixed(2),
            allowance: parseFloat(capturedAllowance).toFixed(2),
            additionalPay: parseFloat(capturedAdditionalPay).toFixed(2),
            otHours: capturedOtHours,
            otPay: parseFloat(capturedOtPay).toFixed(2),
            modeOfPayment: capturedModeOfPayment,
            isResigned: capturedResigned,
            nationality: capturedNationality,
            typeOfContribution: capturedTypeOfContribution,
            joinDate: capturedJoinDate,
            designation: capturedDesignation,
            resignDate: capturedResignDate
        }
        console.log(updatedEmployee);

        fetch(`${apiUrl}/api/employees/${employeeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Employee updated successfully: ", data);
            })
            .catch(error => {
                console.error("Error updating: ", error);
            })
            .then(() => {
                push('/dashboard/employee-list');
            })
    }

  return (
    <div className="box-border w-full flex flex-col items-center mb-16">
        <form className='flex flex-col gap-8 bg-indigo-100 shadow-lg p-6 rounded-lg w-3/5' onSubmit={handleSubmit}>

            <div className='flex gap-4'>
                <div className='flex flex-col gap-8 flex-1'>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Name
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            NRIC/FIN
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.NRIC}
                            onChange={(e) => setNRIC(e.target.value)}
                            required
                        />
                    </div>

                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                        >
                            <legend className="mb-4 text-sm font-bold">
                                Nationality
                            </legend>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="SC/PR"
                                    name="nationality"
                                    value="Singapore Citizen/Permanent Resident"
                                    onChange={(e) => setNationality(e.target.value)}
                                    checked={nationality === "Singapore Citizen/Permanent Resident"}
                                />
                                <Label htmlFor="SC/PR">
                                    Singapore Citizen/Permanent Resident
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="foreigner"
                                    name="nationality"
                                    value="Foreigner"
                                    onChange={(e) => {
                                        setTypeOfContribution(null)
                                        setCitizenshipStatus(null)
                                        setNationality(e.target.value)
                                    }}
                                    checked={nationality === "Foreigner"}
                                />
                                <Label htmlFor="foreigner">
                                    Foreigner
                                </Label>
                            </div>
                        </fieldset>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Date of Birth
                        </div>
                        <TextInput
                            type='date'
                            value={dateOfBirth || formatDate(data.dateOfBirth)}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                        />
                    </div>

                    {nationality === "Singapore Citizen/Permanent Resident" && (
                        <div>
                            <fieldset
                                className="flex max-w-md gap-4"
                                id="radio"
                            >
                                <legend className="mb-4 text-sm font-bold">
                                Citizenship Status
                                </legend>

                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="sc/3rdPR"
                                        name="citizenshipStatus"
                                        value="SC/3rdPR"
                                        checked={citizenshipStatus === "SC/3rdPR"}
                                        onChange={(e) => {
                                            setTypeOfContribution(null)
                                            setCitizenshipStatus(e.target.value)
                                        }}
                                    />
                                    <Label htmlFor="sc/3rdPR">
                                        Singapore Citizen/3rd Year Permanent Resident and above
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="1stPR"
                                        name="citizenshipStatus"
                                        value="1stPR"
                                        checked={citizenshipStatus === "1stPR"}
                                        onChange={(e) => setCitizenshipStatus(e.target.value)}
                                    />
                                    <Label htmlFor="1stPR">
                                        1st Year Permanent Resident
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="2ndPR"
                                        name="citizenshipStatus"
                                        value="2ndPR"
                                        checked={citizenshipStatus === "2ndPR"}
                                        onChange={(e) => setCitizenshipStatus(e.target.value)}
                                    />
                                    <Label htmlFor="2ndPR">
                                        2nd Year Permanent Resident
                                    </Label>
                                </div>
                            </fieldset>
                        </div>
                    )}

                    {((citizenshipStatus) === "2ndPR" || (citizenshipStatus) === "1stPR") && (nationality != "Foreigner") && (
                        <div>
                            <fieldset
                                className="flex max-w-md gap-4"
                                id="radio"
                            >
                                <legend className="mb-4 text-sm font-bold">
                                Type Of Contribution Rates
                                </legend>
            
                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="G/G"
                                        name="typeOfContributionRates"
                                        value="G/G"
                                        checked={typeOfContribution == "G/G"}
                                        onChange={(e) => setTypeOfContribution(e.target.value)}
                                    />
                                    <Label htmlFor="G/G" className='flex flex-col gap-1'>
                                        <div>Graduated Employer Rate and Employee Rate</div>
                                        <p className="italic text-xs">Default Contribution rates for 1st and 2nd year PR</p>
                                    </Label>
                                </div>
            
                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="F/G"
                                        name="typeOfContributionRates"
                                        value="F/G"
                                        checked={typeOfContribution == "F/G"}
                                        onChange={(e) => setTypeOfContribution(e.target.value)}
                                    />
                                    <Label htmlFor="F/G" className='flex flex-col gap-1'>
                                        <div>Full employer rate and graduated employee rate</div>
                                        <p className="italic text-xs">Applicable to 1st and 2nd year PR who have successfully applied to contribute at higher rates with their employers</p>
                                    </Label>
                                </div>
            
                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="F/F"
                                        name="typeOfContributionRates"
                                        value="F/F"
                                        checked={typeOfContribution == "F/F"}
                                        onChange={(e) => setTypeOfContribution(e.target.value)}
                                    />
                                    <Label htmlFor="F/F" className='flex flex-col gap-1'>
                                        <div>Full employer rate and employee rate</div>
                                        <p className="italic text-xs">Applicable to 1st and 2nd year PR who have successfully applied to contribute at higher rates with their employers</p>
                                    </Label>
                                </div>
                                
                            </fieldset>
                        </div>
                    )}

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Basic Pay
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.basicPay}
                            onChange={(e) => setBasicPay(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Allowance Pay
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.allowance}
                            onChange={(e) => setAllowance(e.target.value)}
                            required
                        />
                    </div>

                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                        >
                            <legend className="mb-4 text-sm font-bold">
                            Mode of Payment
                            </legend>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="cash"
                                    name="modeOfPayment"
                                    value="Cash"
                                    checked={modeOfPayment === "Cash"}
                                    onChange={(e) => setModeOfPayment(e.target.value)}
                                />
                                <Label htmlFor="cash">
                                    Cash
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="cheque"
                                    name="modeOfPayment"
                                    value="Cheque"
                                    checked={modeOfPayment === "Cheque"}
                                    onChange={(e) => setModeOfPayment(e.target.value)}
                                />
                                <Label htmlFor="cheque">
                                    Cheque
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="bankDeposit"
                                    name="modeOfPayment"
                                    value="Bank Deposit"
                                    checked={modeOfPayment === "Bank Deposit"}
                                    onChange={(e) => setModeOfPayment(e.target.value)}
                                />
                                <Label htmlFor="bankDeposit">
                                    Bank Deposit
                                </Label>
                            </div>
                            
                        </fieldset>
                    </div>
                </div>

                <div className='flex flex-col gap-8 flex-1'>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Join Date
                        </div>
                        <TextInput
                            type='date'
                            value={joinDate || formatDate(data.joinDate)}
                            onChange={(e) => setJoinDate(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Designation
                        </div>
                        <TextInput
                            type='text'
                            value={data.designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Additional Pay (Bonus)
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.additionalPay}
                            onChange={(e) => setAdditionalPay(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Overtime Hours
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.otHours}
                            onChange={(e) => setOtHours(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Overtime Pay
                        </div>
                        <TextInput
                            type='text'
                            defaultValue={data.otPay}
                            onChange={(e) => setOtPay(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                        >
                            <legend className="mb-4 text-sm font-bold">
                            Employee Status
                            </legend>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="active"
                                    name="isResigned"
                                    value="false"
                                    checked={!isResigned}
                                    onChange={(e) => {
                                        setIsResigned(e.target.value)
                                        setShowResignation(false)
                                    }}
                                />
                                <Label htmlFor="active">
                                    Active
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="resigned"
                                    name="isResigned"
                                    value="true"
                                    checked={isResigned}
                                    onChange={(e) => {
                                        setIsResigned(e.target.value)
                                        setShowResignation(true)
                                    }}
                                />
                                <Label htmlFor="resigned">
                                    Resigned
                                </Label>
                            </div>
                            
                        </fieldset>
                    </div>

                    {showResignation && (
                        <div className='flex flex-col gap-4'>
                            <div className="text-sm font-bold">
                                Resignation Date
                            </div>
                            <TextInput
                                type='date'
                                value={resignDate}
                                onChange={(e) => setResignDate(e.target.value)}
                            />
                        </div>
                    )}
                    
                </div>
            </div>

            <div className='flex gap-6 justify-center'>
                <Button type='submit' className="bg-sky-700 hover:bg-sky-600"> Update Employee </Button>
                <Button className="bg-rose-400 hover:bg-rose-500">
                    <Link href="/dashboard/employee-list">Cancel</Link>
                </Button>
            </div>
            
        </form>
    </div>
  )
}

export default EditEmployee
'use client'
import React, { useEffect, useState } from 'react'
import { Button, Label, TextInput, Radio } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const CreateEmployee = () => {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const [name, setName] = useState('');
    const [NRIC, setNRIC] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [citizenshipStatus, setCitizenshipStatus] = useState('');
    const [basicPay, setBasicPay] = useState('');
    const [allowance, setAllowance] = useState('');
    const [additionalPay, setAdditionalPay] = useState('0');
    const [otHours, setOtHours] = useState('0');
    const [otPay, setOtPay] = useState('0');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [isResigned, setIsResigned] = useState(false);

    const [nationality, setNationality] = useState('');
    const [typeOfContribution, setTypeOfContribution] = useState('');

    const [joinDate, setJoinDate] = useState('');
    const [designation, setDesignation] = useState('');
    const [resignDate, setResignDate] = useState('');

    const [showResignation, setShowResignation] = useState(isResigned);

    const { push } = useRouter();
    const session = useSession();
    const companyName = session.data.user.name.companyName;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const capturedAdditionalPay = additionalPay || "0";
        const capturedOtPay = otPay || "0";
        const capturedOtHours = otHours || "0";

        const newEmployee = {
            name: name,
            NRIC: NRIC,
            dateOfBirth: dateOfBirth,
            citizenshipStatus: citizenshipStatus,
            basicPay: parseFloat(basicPay).toFixed(2),
            allowance: parseFloat(allowance).toFixed(2),
            additionalPay: parseFloat(capturedAdditionalPay).toFixed(2),
            otHours: capturedOtHours,
            otPay: parseFloat(capturedOtPay).toFixed(2),
            modeOfPayment: modeOfPayment,
            isResigned: isResigned,
            nationality: nationality,
            typeOfContributionRate: typeOfContribution,
            joinDate: joinDate,
            designation: designation,
            resignDate: resignDate,
            companyName: companyName
        }

        try {
            const res = await fetch(`${apiUrl}/api/employees`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            })
            .then(() => {
                push('/dashboard/employee-list');
            })

        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className="box-border w-full flex flex-col items-center mb-16">
        <form className='flex flex-col gap-8 bg-indigo-100 shadow-lg p-6 rounded-lg w-3/5' onSubmit={handleSubmit}>
            <div className='flex gap-6'>
                <div className='flex flex-col gap-8 flex-1'>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Name
                        </div>
                        <TextInput
                            type='text'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            NRIC/FIN
                        </div>
                        <TextInput
                            type='text'
                            required
                            value={NRIC}
                            onChange={(e) => setNRIC(e.target.value)}
                        />
                    </div>
                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                            required
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
                                    onChange={(e) => setNationality(e.target.value)}
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
                            value={dateOfBirth}
                            required
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>
                    {nationality === "Singapore Citizen/Permanent Resident" && (
                        <div>
                            <fieldset
                                className="flex max-w-md flex-col gap-4"
                                id="radio"
                                required
                            >
                                <legend className="mb-4 text-sm font-bold">
                                Citizenship Status
                                </legend>
                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="sc/3rdPR"
                                        name="citizenshipStatus"
                                        value="SC/3rdPR"
                                        onChange={(e) => setCitizenshipStatus(e.target.value)}
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
                                        onChange={(e) => setCitizenshipStatus(e.target.value)}
                                    />
                                    <Label htmlFor="2ndPR">
                                        2nd Year Permanent Resident
                                    </Label>
                                </div>
                            </fieldset>
                        </div>
                    )}
                    {(citizenshipStatus === "2ndPR" || citizenshipStatus === "1stPR") && (
                        <div>
                            <fieldset
                                className="flex max-w-md flex-col gap-4"
                                id="radio"
                                required
                            >
                                <legend className="mb-4 text-sm font-bold">
                                Type Of Contribution Rates
                                </legend>
                                <div className="flex items-center gap-2">
                                    <Radio
                                        id="G/G"
                                        name="typeOfContributionRates"
                                        value="G/G"
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
                            value={basicPay}
                            required
                            onChange={(e) => setBasicPay(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Allowance Pay 
                        </div>
                        <TextInput
                            type='text'
                            value={allowance}
                            required
                            onChange={(e) => setAllowance(e.target.value)}
                        />
                    </div>
                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                            required
                        >
                            <legend className="mb-4 text-sm font-bold">
                            Mode of Payment
                            </legend>
                            <div className="flex items-center gap-2">
                                <Radio
                                    id="cash"
                                    name="modeOfPayment"
                                    value="Cash"
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
                            value={joinDate}
                            required
                            onChange={(e) => setJoinDate(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Designation
                        </div>
                        <TextInput
                            type='text'
                            required
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Additional Pay (Bonus)
                        </div>
                        <TextInput
                            type='text'
                            value={additionalPay}
                            onChange={(e) => setAdditionalPay(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Overtime Hours
                        </div>
                        <TextInput
                            type='text'
                            value={otHours}
                            onChange={(e) => setOtHours(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="text-sm font-bold">
                            Overtime Pay
                        </div>
                        <TextInput
                            type='text'
                            value={otPay}
                            onChange={(e) => setOtPay(e.target.value)}
                        />
                    </div>

                    <div className='h-[78px]'>
                        <fieldset
                            className="flex max-w-md gap-4"
                            id="radio"
                            required
                        >
                            <legend className="mb-4 text-sm font-bold">
                            Employee Status
                            </legend>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="active"
                                    name="isResigned"
                                    value={false}
                                    onChange={(e) => {
                                        setIsResigned(false)
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
                                    value={true}
                                    onChange={(e) => {
                                        setIsResigned(true)
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
                <Button type='submit' className="bg-sky-700 hover:bg-sky-600"> Create Employee </Button>
                <Button className="bg-rose-400 hover:bg-rose-500"> 
                    <Link href="/dashboard">Cancel</Link> 
                </Button>
            </div>



        </form>
    </div>
  )
}

export default CreateEmployee
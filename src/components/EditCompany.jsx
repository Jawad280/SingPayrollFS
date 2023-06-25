'use client'

import React, { useState } from 'react'
import { Button, Label, TextInput, Radio } from 'flowbite-react';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EditCompany = ({companyId}) => {
    
    const [username, setUsername] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [license, setLicense] = useState('');

    const { push } = useRouter();

    // fetch company
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/users/${companyId}`, fetcher);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const capturedUsername = username || data.username;
        const capturedCompanyname = companyName || data.companyName;
        const capturedLicence = license || data.license;

        const updatedCompany = {
            username: capturedUsername,
            companyName: capturedCompanyname,
            license: capturedLicence
        }

        fetch(`http://localhost:3000/api/users/${companyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCompany),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Company updated successfully: ", data);
        })
        .catch(error => {
            console.error("Error updating: ", error);
        })
        .then(() => {
            push('/dashboard');
        })
    }

    return (
        <div className='flex flex-col items-center mt-10 gap-10'>
            
            <form onSubmit={handleSubmit} className='flex flex-col gap-8 p-8 bg-indigo-100 shadow-lg rounded-lg items-center box-border'>
                <div>
                    <div className="mb-2 block">
                    <Label
                        htmlFor="username"
                        value="Enter Username"
                    />
                    </div>
                    <TextInput
                        id="username"
                        placeholder="Enter Username"
                        type="text"
                        defaultValue={data.username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
    
                <div>
                    <div className="mb-2 block">
                    <Label
                        htmlFor="companyName"
                        value="Enter Company Name"
                    />
                    </div>
                    <TextInput
                    id="companyName"
                    placeholder="Enter Company Name"
                    type="text"
                    defaultValue={data.companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
    
                <div>
                    <div className="mb-2 block">
                    <Label
                        htmlFor="license"
                        value="Choose License Expiry Date"
                    />
                    </div>
                    <TextInput
                    id="license"
                    placeholder="Choose License Expiry Date"
                    type="date"
                    defaultValue={data.license}
                    onChange={(e) => setLicense(e.target.value)}
                    />
                </div>
    
                <Button type='submit' className="box-border w-full bg-sky-700 hover:bg-sky-600"> Update Account </Button>
                <Button 
                    type='submit' 
                    className="box-border w-full bg-rose-500 hover:bg-rose-400"
                    onClick={() => setClicked(false)}
                > Cancel </Button>
    
            </form>
        </div>
    )
}

export default EditCompany
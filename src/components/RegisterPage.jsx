'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Label, TextInput } from 'flowbite-react';

const RegisterPage = ({setClicked}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [license, setLicense] = useState('');

    const [err, setErr] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {username, companyName, password, isAdmin: false, license: license};

        try {
            const res = await fetch( apiUrl + "/api/users/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            console.log(res.status);
            res.status === 201 && setClicked(false);
        } catch(err) {
            console.log(err);
            setErr(true);
        }
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
                required
                type="text"
                value={username}
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
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>

            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="password"
                    value="Enter Password"
                />
                </div>
                <TextInput
                id="password"
                placeholder="Enter Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                required
                type="date"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                />
            </div>

            <Button type='submit' className="box-border w-full bg-sky-700 hover:bg-sky-600"> Create Account </Button>
            <Button 
                type='submit' 
                className="box-border w-full bg-rose-500 hover:bg-rose-400"
                onClick={() => setClicked(false)}
            > Cancel </Button>

        </form>
    </div>
  )
}

export default RegisterPage
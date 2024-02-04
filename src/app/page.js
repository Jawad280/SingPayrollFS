'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import Image from 'next/image';
import Loading from '@/components/Loading';

export default function Home() {
  // 2024

  const session = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const checkDate = (date) => {
    const currentDate = new Date();
    const comparisonDate = new Date(date);
    return comparisonDate > currentDate
  }

  const oneMonthWarning = (date) => {
    const currentDate = new Date();
    const comparisonDate = new Date(date);
  
    // Calculate the difference in milliseconds between the two dates
    const timeDiff = comparisonDate.getTime() - currentDate.getTime();
  
    // Calculate the number of milliseconds in a day
    const oneDayMs = 24 * 60 * 60 * 1000;
  
    // Calculate the number of days left
    const daysLeft = Math.round(timeDiff / oneDayMs);
  
    // Check if the date is less than one month away (30 days)
    const isLessThanOneMonth = (daysLeft < 30) && (daysLeft >= 0);
  
    return [
      isLessThanOneMonth,
      daysLeft,
    ];    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password)
    signIn("credentials", { username, password });
  }


  if (session.status === 'loading') {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  if (session.status === 'authenticated') {
    const license = session.data.user?.name?.license;
  
    const [isLessThanOneMonth, daysLeft] = oneMonthWarning(license);
  
    if (isLessThanOneMonth && !(session.data.user?.name?.isAdmin)) {
      alert("Your license expires in " + daysLeft + " days");
      router?.push("/dashboard");
    }
  
    if (session.data.user?.name?.isAdmin || checkDate(license)) {
      router?.push("/dashboard");
    } else {
      alert("Your license has expired!");
      signOut();
    }
  }

  if (session.status === 'unauthenticated') {
    return (
      <div className='flex flex-col items-center mt-10 gap-10'>
        <div>
          <Image src="/payroll.png" width={175} height={175} alt='SingPayroll'/>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-8 p-6 bg-indigo-100 shadow-lg rounded-lg items-center'>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="username"
                value="Username"
              />
            </div>
            <TextInput
              id="username"
              placeholder="Enter Username"
              required
              autoComplete="off"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                value="Password"
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

          <Button type='submit' className="box-border w-full bg-sky-700 hover:bg-sky-600"> Login </Button>
        </form>
      </div>
    )
  }


}

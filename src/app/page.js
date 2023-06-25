'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import Link from 'next/link';

export default function Home() {

  const session = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clicked, setClicked] = useState(false);

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
    const isLessThanOneMonth = daysLeft < 30;
  
    return [
      isLessThanOneMonth,
      daysLeft,
    ];    
  }

  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    signIn("credentials", { username, password });
  }


  if (session.status === 'loading') {
    return <p>Loading...</p>
  }

  if (session.status === 'authenticated') {
    const license = session.data.user?.name?.license;
  
    const [isLessThanOneMonth, daysLeft] = oneMonthWarning(license);
  
    if (isLessThanOneMonth) {
      alert("Your license expires in " + daysLeft + " days");
      router?.push("/dashboard");
    }
  
    if (checkDate(license) || session.data.user?.name?.isAdmin) {
      router?.push("/dashboard");
    } else {
      signOut();
    }
  }

  if (session.status === 'unauthenticated') {
    return (
      <div className='flex flex-col items-center mt-10 gap-10'>
        <div className="font-bold text-[24px]">SingPayroll</div>

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

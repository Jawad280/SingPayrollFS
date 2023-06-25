'use client'
import React, { useRef, useState } from 'react'
import { Table } from 'flowbite-react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const EmployeeTable = () => {

  const session = useSession();
  const companyName = session.data.user.name.companyName;
    // fetch employees
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`/api/employees/companyName/${companyName}`, fetcher);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = async(employeeId) => {
    try {
        const res = await fetch(`/api/employees/${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(res.status);
        res.status === 200;
        mutate('/api/employees');
    } catch(error) {
        console.log(error);
    }
  }

  

  return (
    <div>
        <Table>
            <Table.Head>
                <Table.HeadCell>
                    S/N
                </Table.HeadCell>

                <Table.HeadCell>
                    Employee Name
                </Table.HeadCell>

                <Table.HeadCell>
                    NRIC
                </Table.HeadCell>

                <Table.HeadCell>
                    Date Of Birth
                </Table.HeadCell>

                <Table.HeadCell>
                    Designation
                </Table.HeadCell>

                <Table.HeadCell>
                    Join Date
                </Table.HeadCell>

                <Table.HeadCell>
                    Status
                </Table.HeadCell>

                <Table.HeadCell>
                    <span className="sr-only">
                    Edit
                    </span>
                </Table.HeadCell>

                <Table.HeadCell>
                    <span className="sr-only">
                    Delete
                    </span>
                </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
                {console.log(data)}

            {data?.map((x, index) => (
                <Table.Row key={index+1} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{index+1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.name}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.NRIC}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{new Date(x.dateOfBirth).toLocaleDateString('en-GB')}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.designation}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{new Date(x.joinDate).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.isResigned ? "Resigned" : "Active"}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <Link href={`/dashboard/employee-list/${x.id}`} >
                            <Image src="/pencil-square.svg" alt="Edit" height={16} width={16} />
                        </Link>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div onClick={() => handleDelete(x.id)} className="cursor-pointer">
                            <Image src="/trash.svg" alt="Edit" height={16} width={16} />
                        </div>
                    </Table.Cell>
                </Table.Row>
            ))}

            </Table.Body>
        </Table>
    </div>
  )
}

export default EmployeeTable
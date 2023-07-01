'use client'
import React, { useState } from 'react'
import { Table } from 'flowbite-react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Popup from './Popup';
import Loading from './Loading';

import { Button } from 'flowbite-react';

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx';

const handleDownload = () => {
  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.table_to_sheet(document.getElementById('employee-table'));

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee List');

  const xlFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  saveAs(new Blob([xlFile]), 'employee-data.xlsx');
}

const EmployeeTable = () => {

  const session = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const companyName = session.data.user.name.companyName;

    const [open, setOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState('');

    // fetch employees
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

  const sortedEmployees = data?.sort((a, b) => a.name.localeCompare(b.name));

  const handleDelete = async (canDelete) => {
    if (canDelete) {
        try {
            const res = await fetch(`${apiUrl}/api/employees/${employeeId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              res.status === 200;
              mutate(`${apiUrl}/api/employees/companyName/${companyName}`);
        } catch (error) {
          console.log(error);
        }
    }
  };

  

  return (
    <div className='flex flex-col items-center gap-8'>
        <div>
            <Table id='employee-table'>
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
                        Resign Date
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
                {sortedEmployees?.map((x, index) => (
                    <Table.Row key={index+1} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{index+1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.name}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.NRIC}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{new Date(x.dateOfBirth).toLocaleDateString('en-GB')}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.designation}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{new Date(x.joinDate).toLocaleDateString('en-GB')}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{x.isResigned ? "Resigned" : "Active"}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {
                                x.resignDate ? new Date(x.resignDate).toLocaleDateString('en-GB') : "NIL"
                            }
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <Link href={`/dashboard/employee-list/${x.id}`} >
                                <Image src="/pencil-square.svg" alt="Edit" height={16} width={16} />
                            </Link>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <div onClick={() => {
                                setOpen(true)
                                setEmployeeId(x.id)
                            }} className="cursor-pointer">
                                <Image src="/trash.svg" alt="Edit" height={16} width={16} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
            {
                open &&
                <Popup label={"Are you sure you want to delete this employee ?"} setOpen={setOpen} fn={handleDelete}/>
            }
        </div>
        <Button onClick={handleDownload}>Download</Button>
    </div>
  )
}

export default EmployeeTable
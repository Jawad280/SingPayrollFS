'use client'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr';
import { Table } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';

const AdminPage = () => {

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(`/api/users`, fetcher);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }

  return (
    <div className="box-border w-full">
        <Table>
            <Table.Head>
                <Table.HeadCell>
                    S/N
                </Table.HeadCell>

                <Table.HeadCell>
                    Created Companies
                </Table.HeadCell>

                <Table.HeadCell>
                    License Expiry Date
                </Table.HeadCell>

                <Table.HeadCell>
                    <span className="sr-only">
                        Edit
                    </span>
                </Table.HeadCell>

            </Table.Head>

            <Table.Body>
                {data.filter((x) => !x.isAdmin).map((item, index) => (
                    <Table.Row key={index+1} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{index+1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item.companyName}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex flex-col items-center">{new Date(item.license).toLocaleDateString('en-GB')}</Table.Cell>
                        <Table.Cell>
                            <Link href={`/dashboard/edit-company/${item.id}`}>
                                <Image src="/pencil-square.svg" alt="Edit" height={16} width={16} />
                            </Link>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
  )
}

export default AdminPage
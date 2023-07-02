'use client'
import React from 'react'
import useSWR from 'swr';
import Loading from './Loading';
import { Table } from 'flowbite-react';

const Month = ({ companyName }) => {

    // fetch payslips
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/payslips/company/${companyName}`, fetcher);

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

  return (
    <div className='flex flex-col items-center'>

        <Table>
            <Table.Head>
                <Table.HeadCell>
                    Months Generated
                </Table.HeadCell>
            </Table.Head>

            <Table.Body>
                {
                    data
                    .filter((x, index, self) => self.findIndex((item) => item.name === x.name) === index) // Filter out duplicates
                    .sort((a, b) => new Date(b.name) - new Date(a.name)) // Sort in descending order
                    .slice(0, 4)
                    .map((x) => (
                        <Table.Row>
                            <Table.Cell key={x.id}>{x.name}</Table.Cell>
                        </Table.Row>
                    ))
                }

            </Table.Body>
        </Table>
    </div>

  )
}

export default Month
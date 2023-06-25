import EditEmployee from '@/components/EditEmployee'
import React from 'react'

const SingleEmployee = ({params}) => {
  return (
    <div className="box-border flex flex-col w-full items-center">
        <EditEmployee employeeId={params.id} />
    </div>
  )
}

export default SingleEmployee
import EditCompany from '@/components/EditCompany';
import React from 'react'

const Edit = ({params}) => {

    const companyId = params.id;

    return (
        <div>
            <EditCompany companyId={companyId} />
        </div>
    )

}

export default Edit
'use client'
import React from 'react'
import { Button } from 'flowbite-react'

const PopupMonth = ({setOpen, label, fn}) => {
  return (
    <div className="flex flex-col p-6 gap-8 rounded-md bg-indigo-100 items-center shadow-md w-[300px] h-[200px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id='popup'>
        <div className="text-center font-semibold">{label}</div>
        <div className="flex justify-center gap-10">
            <Button className="bg-blue-600 hover:bg-blue-400" onClick={() => {
                fn(true)
                setOpen(false)
            }}>Yes</Button>
            <Button className="bg-red-700  hover:bg-red-600" onClick={() => {
                fn(false)
                setOpen(false)
            }}>Cancel</Button>
        </div>
    </div>
  )
}

export default PopupMonth
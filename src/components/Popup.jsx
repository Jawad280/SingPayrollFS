'use client'
import React from 'react'
import { Button } from 'flowbite-react'

const Popup = ({setOpen, label, fn}) => {
  return (
    <div className="flex flex-col p-6 gap-8 rounded-md bg-slate-50 items-center shadow-md w-[300px] h-[200px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id='popup'>
        <div className="text-center">{label}</div>
        <div className="flex justify-center gap-10">
            <Button className="bg-red-700 hover:bg-red-600" onClick={() => {
                fn(true)
                setOpen(false)
            }}>Yes Delete</Button>
            <Button className="bg-gray-500 hover:bg-gray-400" onClick={() => {
                setOpen(false)
            }}>Cancel</Button>
        </div>
    </div>
  )
}

export default Popup
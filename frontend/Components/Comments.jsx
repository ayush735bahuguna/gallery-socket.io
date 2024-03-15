import Image from 'next/image'
import React from 'react'

export default function Comments({ text }) {


    return (
        <div className='w-full p-2 hover:bg-slate-100 bg-slate-50 my-1 cursor-pointer rounded-md flex gap-2 items-center'>
            <div className='rounded-full w-10 h-10 bg-slate-400'></div>
            {text}
        </div>
    )
}

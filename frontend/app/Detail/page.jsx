"use client"
import Comments from '@/Components/Comments'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

export default function page() {
    const router = useRouter();
    const params = useSearchParams();
    const Id = params.get('Id')

    const [Data, setData] = useState()
    const [comment, setcomment] = useState('')
    const [commentData, setcommentData] = useState([])
    useEffect(() => {
        fetchApi();
    }, [])

    useEffect(() => {
        socket.on('indivisual-post-comment', (newPosts) => {
            setcommentData(newPosts?.comments)
        });
    }, [socket])

    async function fetchApi() {
        const { data } = await axios.get(`http://localhost:3001/singlePost/${Id}`);
        setData(data);
        setcommentData(data?.comments);
    }

    async function addComment() {
        const { data } = await axios.put(`http://localhost:3001/addComment/${Id}`, { comment: comment });
        setcommentData(data?.post?.comments);
        setcomment('')
    }

    return (
        <>
            <span className='bg-slate-200 p-2 fixed top-3 left-3 rounded-full cursor-pointer'
                onClick={() => { router.push('/') }}>
                <X />
            </span>
            <Image
                src={Data?.ImageUrl}
                unoptimized
                quality={100}
                height="140"
                width={100}
                alt=''
                className='h-auto max-h-dvh object-contain w-full'
            />
            <div className='p-2 flex justify-center items-center sm:w-2/3 max-sm:w-full mx-auto flex-col'>
                {commentData?.map((e, i) => {
                    return <Comments text={e} key={i} />
                })}
                <div className='flex gap-2 w-full'>
                    <TextField label="Add comments" variant="outlined" className='w-full' value={comment} onChange={(e) => { setcomment(e.target.value) }} />
                    <Button onClick={addComment} variant='outlined' className='h-[55px]'>Add</Button>
                </div>
            </div>
        </>
    )
}

"use client"
import CardComponent from '@/Components/CardComponent';
import DialogComponent from '@/Components/DialogComponent';
import { ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'

import io from "socket.io-client";
const socket = io.connect("https://gallery-socket-io.onrender.com");

export default function Page() {
  const [Data, setData] = useState([]);
  const [newData, setnewData] = useState(null);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const fetchApi = async () => {
    const { data } = await axios.get('https://gallery-socket-io.onrender.com/all');
    setData(data);
    // console.log(data);
  }

  useEffect(() => { fetchApi() }, [])

  useEffect(() => {
    socket.on('add-like', (newPosts) => {
      setData(newPosts);
    });
    socket.on('add-comment', (newPosts) => {
      setData(newPosts);
    });
  }, [socket])

  useEffect(() => {
    if (newData !== null) {
      setData([newData, ...Data])
      // console.log([newData, ...Data]);
    }
  }, [newData])

  return (
    <div className='relative'>
      <p className='text-4xl p-2 text-slate-600'>Image Gallery</p>
      {Data.length !== 0 ?
        <>
          <ImageList variant="masonry" cols={sm ? 1 : (lg ? 2 : 3)} gap={2} className='my-5 py-2'>
            {Data?.map((e, i) => {
              return <ImageListItem key={i} className='mb-1'>
                <CardComponent ImageUrl={e?.ImageUrl} title={e?.title} Description={e?.Description} Id={e?._id}
                  commentCount={e?.comments?.length}
                  likesCount={e?.likes?.length}
                />
              </ImageListItem>
            })}
          </ImageList>
        </>
        :
        <div className='w-full h-dvh flex justify-center items-center'>No Images</div>
      }
      <div className='fixed bottom-10 right-10'>
        <DialogComponent setnewData={setnewData} />
      </div>
    </div>
  )
}

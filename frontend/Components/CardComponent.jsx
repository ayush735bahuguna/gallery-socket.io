"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Image from 'next/image';
import { Heart, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CardComponent({ ImageUrl, title, Description, Id, commentCount, likesCount }) {
    const router = useRouter();

    async function IncreaseLike() {
        const { data } = await axios.put(`https://gallery-socket-io.onrender.com/increase/${Id}`);
        console.log(data);
    }
    return (
        <Card className='m-1'>
            <CardActionArea onClick={() => { router.push(`/Detail?Id=${Id}`) }}>
                <Image
                    src={ImageUrl}
                    height="140"
                    width={100}
                    alt=''
                    className='h-auto w-full'
                    unoptimized
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{Description}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" className='rounded-full p-1' onClick={IncreaseLike}>
                    <Heart /> &nbsp; {likesCount} like
                </Button>
                <Button size='small' className='rounded-full'>
                    <MessageSquare /> &nbsp; {commentCount} comment
                </Button>
            </CardActions>
        </Card>
    );
}

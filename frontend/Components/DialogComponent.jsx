"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Alert, Fab, Input, Snackbar, TextField } from '@mui/material';
import { Loader2, Plus, Upload, X } from 'lucide-react';
import axios from 'axios';

export default function DialogComponent({ setnewData }) {
    const [open, setOpen] = React.useState(false);
    const [snackBarOpen, setSnackBarOpen] = React.useState(false);
    const [ErrorSnackBarOpen, setErrorSnackBarOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [file, setfile] = React.useState(null);
    const [Image, setImage] = React.useState(null);
    const [loading, setloading] = React.useState(false);
    const [Title, setTitle] = React.useState(null);
    const [Description, setDescription] = React.useState(null);

    const handleClickOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const handlesnackBarClose = () => { setSnackBarOpen(false) };
    const handleErrorSnackBarOpen = () => { setErrorSnackBarOpen(false) };

    const uploadImage = async () => {
        setloading(true);

        if (Image?.size > 5242880) {
            // throw new Error('Image Size more than 5MB');
            setErrorSnackBarOpen(true)
            setloading(false);
            handleClose();
        }
        else {
            if (Image) {
                const { data } = await axios.post('https://gallery-socket-io.onrender.com/upload/', { image: Image, Description: Description, title: Title }, { headers: { "Content-Type": "multipart/form-data" } })
                setnewData(data);
                setSnackBarOpen(true)
                setloading(false);
                handleClose();
            }
        }

    }

    return (
        <React.Fragment>
            <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handlesnackBarClose}>
                <Alert
                    onClose={handlesnackBarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Image Uploaded!
                </Alert>
            </Snackbar>

            <Snackbar open={ErrorSnackBarOpen} autoHideDuration={6000} onClose={handleErrorSnackBarOpen}>
                <Alert
                    onClose={handleErrorSnackBarOpen}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Image Size more than 5MB!
                </Alert>
            </Snackbar>

            <Fab aria-label="add" color='default' onClick={handleClickOpen} className='bg-white'>
                <Plus color='black' size={30} />
            </Fab>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="Upload-image"
            >
                <DialogTitle id=" Upload-image" >
                    Upload image
                </DialogTitle>
                <DialogContent>
                    <div className="sm:w-[500px]"></div>
                    {!file ?
                        <>
                            <label htmlFor='file'>
                                <div className='w-full h-40 outline-dashed rounded-lg flex items-center justify-center hover:cursor-pointer gap-2 hover:outline-sky-600 my-2'>
                                    <Upload size={50} />
                                    <p>Upload Image</p>
                                </div>
                            </label>
                            <input disabled={loading} type='file' id='file' className='hidden' accept="image/png, image/gif, image/jpeg"
                                onChange={async (e) => {
                                    setImage(e.target.files[0])
                                    var reader = new FileReader();
                                    reader.onload = function () {
                                        setfile(reader.result);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }}
                            />

                        </>
                        :
                        <>
                            <div className="flex items-center justify-center" style={{ width: '100%', borderRadius: '10px', position: 'relative' }}>

                                <button variant={'outline'} style={{ width: 'fit-content', position: 'absolute', top: '20px', right: '20px' }} className="bg-slate-950 text-white rounded-full p-2 shadow-2xl" onClick={() => {
                                    setfile(null);
                                }}>
                                    <X />
                                </button>
                                <img
                                    src={file}
                                    alt=' '
                                    className="rounded-xl shadow"
                                />
                            </div>
                        </>
                    }
                    <TextField label="Title..."
                        disabled={loading}
                        value={Title} onChange={(e) => { setTitle(e.target.value) }}
                        variant="outlined" className='mt-5 w-full' />

                    <TextField label="Image description..."
                        disabled={loading}
                        value={Description} onChange={(e) => { setDescription(e.target.value) }}
                        variant="outlined" className='mt-5 w-full' />
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} autoFocus onClick={uploadImage}> {loading && <Loader2 className='animate-spin' />}  Upload</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}












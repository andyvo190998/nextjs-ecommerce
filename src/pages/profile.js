/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/Layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';

const profile = () => {
  const { data: session } = useSession();

  //user input
  const [item, setItem] = useState();

  //dialog
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //change password function
  const openDialog = async () => {
    setOpen(true);

    // const newPassword = {
    //   newPassword: 'asds',
    // };
    // const data = await axios.put('/api/password', newPassword);
  };

  const handleOnChange = (e) => {
    // const value = e.target.value;
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async () => {
    if (item.newPassword.length < 6) {
      toast.error('Password has to be 6 or more characters!');
      return;
    }
    if (item.newPassword !== item.repeatPassword) {
      toast.error('New password and repeat password are not matched');
      return;
    } else {
      try {
        const password = {
          oldPassword: item.oldPassword,
          newPassword: item.newPassword,
        };

        const { data } = await axios.put('/api/password', password);
        toast.success(data.message);
        setOpen(false);
      } catch (error) {
        toast.error(error.response.data.message);
        return;
      }
    }
  };
  return (
    <Layout title='Profile'>
      <div className='flex justify-center mt-10'>
        <div></div>
        <div>
          <div className='mb-3'>Name: {session.user.name}</div>
          <div className='mb-3'>Email: {session.user.email}</div>
          <button onClick={openDialog} className='primary-button'>
            Change Password
          </button>
        </div>
        <div></div>
      </div>
      {/* dialog form */}
      <div>
        <Dialog onSubmit={changePassword} open={open} onClose={handleClose}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              name='oldPassword'
              onChange={handleOnChange}
              autoFocus
              margin='dense'
              label='Old password'
              type='password'
              fullWidth
              variant='standard'
            />
            <TextField
              name='newPassword'
              onChange={handleOnChange}
              autoFocus
              margin='dense'
              label='New password'
              type='password'
              fullWidth
              variant='standard'
            />
            <TextField
              name='repeatPassword'
              onChange={handleOnChange}
              autoFocus
              margin='dense'
              label='Repeat new password'
              type='password'
              fullWidth
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={changePassword}>Apply</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default profile;
profile.auth = true;

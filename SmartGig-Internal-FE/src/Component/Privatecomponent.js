import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Privatecomponent = () => {
  const auth = localStorage.getItem('TOKEN');
  const role = localStorage.getItem('ROLE_OF_ADMIN');


  return ((auth) && (role == "SUPER_ADMIN")) ? <Outlet /> : <Navigate to="/" />
}

export default Privatecomponent;
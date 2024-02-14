
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Dialog from "@mui/material/Dialog";
import "../API/api"
import { toast } from 'react-toastify';


const Login = () => {
  const [tokenforAdmin, setTokenforAdmin] = useState();
  const [adminidforAdmin, setAdminidforAdmin] = useState();
  const [checkpassword, setCheckpassword] = useState(false);
  const [errorup, setErrorup] = React.useState("");
  const [newpasswordagain, setNewpasswordagain] = useState("");
  const [err, setErr] = useState("");
  const [user, setUser] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    newpassword: "",
  })

  const navigate = useNavigate();



  const handleChange = (e) => {
    setErr("");
    setUser("");
    setValues({
      ...values,
      [e.target.name]: [e.target.value]
    })
  }

  const { email, password, newpassword } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${global.API_URL}/smg/admin/adminLogin`, {
      email: `${email}`,
      password: `${password}`,
    })
      .then((res) => {

        if (res.data.msg == "admin not found") {
          setUser("User does not exist")
        }
        else if (res.data.msg == "Bad Credetials") {
          setErr("Password incorrect")
        }
        else if (res.data.isPasswordChanged === false) {
          setTimeout(() => {
            setTokenforAdmin(res.data.token);
            setAdminidforAdmin(res.data.adminId);
            setCheckpassword(true);
          }, 2000)

          toast.warning("Change Your Password")
        }

        else if (res.data.isPasswordChanged === true) {

          let adminId = res.data.adminId;
          let Token = res.data.token;
          let roleofadmin = res.data.role;
          let adminName = res.data.adminName;
          let Image = res.data.image;
          window.localStorage.setItem("IMAGE_OF_ADMIN", Image);
          window.localStorage.setItem("ROLE_OF_ADMIN", (roleofadmin));
          window.localStorage.setItem("TOKEN", JSON.stringify(Token));
          window.localStorage.setItem("ADMIN_ID", JSON.stringify(adminId));
          window.localStorage.setItem("ADMIN_NAME", (adminName))
          setTimeout(() => {
            const auth = localStorage.getItem("TOKEN");
            const role = localStorage.getItem("ROLE_OF_ADMIN")
            if (auth && (role == "SUPER_ADMIN")) {
              navigate('/profilepage/employeelist')
            }
            else if (auth && (role == "ADMIN")) {
              navigate('/hrProfile/candidatelist')
            }
            else if (auth && (role == "Employee")) {
              navigate('/employeeProfile/applyLeave')
            }
          }, 2000);
          toast.success("Logged In Successfully")
        }
      }).catch((error) => {
        console.log('some error', error)
      })
  }

  const evenHandler1 = (e) => {
    const newpasswordagain = (e.target.value);
    setNewpasswordagain(newpasswordagain)
    //  eslint-disable-next-line 
    if (newpassword != newpasswordagain) {
      setErrorup("Password doesn't match");
    }
    else {
      setErrorup("");
    }
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    axios.patch(`${global.API_URL}/smg/admin/change-password/${adminidforAdmin}`, {
      password: `${newpassword}`
    }, {
      headers: {
        'Authorization': `Bearer ${tokenforAdmin}`
      }
    })
      .then((res) => {
        // console.log("response see", res.data);
        if (res.data.msg == "password changed") {
          toast.success("Password Changed Successfully");
        }
        setCheckpassword(false);
        navigate("/");
      })
      .catch((err) => {
        console.log("some error here", err);
      })
  }

  return (
    <>

      <Dialog open={checkpassword} >
        <form style={{ padding: "25px", zIndex: "1", width: '30vw', }} onSubmit={handlePasswordChange}>
          <h5 style={{ textAlign: 'center' }}>
            Change Passowrd
          </h5>
          <label>New Password</label>
          <input value={newpassword} name="newpassword" onChange={handleChange} className='form-control' type="password" placeholder='Enter your Password'></input>
          <label>Re Enter Password</label>
          <input name="newpasswordagain" value={newpasswordagain} onChange={evenHandler1} className='form-control' type="password" placeholder='Enter your Password again'></input>
          <span style={{ color: "red", fontWeight: "normal" }}>{errorup}</span>
          <hr />
          <button className='btn' type="submit" style={{ backgroundColor: '#031e30', color: 'white', float: "right" }}>Change Password</button>
        </form>
      </Dialog>

      <div className='Bg-Image'>
        <div className='ImgDiv'>
          <img src='https://smartgiginternalfrontend.s3.ap-south-1.amazonaws.com/white.png' alt='logo' className='Logo' />
        </div>
        <div className='LoginContent'>
          <div className='LoginForm'>
            <img src='https://smartgiginternalfrontend.s3.ap-south-1.amazonaws.com/1.png' alt='symbol' width="100" height="100" />
            <h4>Sign In to your Account</h4>
            <span style={{ color: 'gray' }}>Welcome Back! Please Enter Your Details</span>

            <form className='formInput' onSubmit={handleSubmit}>
              <div>
                <input type="email" name="email" className='form-control' placeholder='Email' value={email} onChange={handleChange} />
                <p style={{ color: "red", textAlign: "left", fontSize: "smaller" }}>{user}</p>
              </div>
              <div>
                <input value={password} name="password" onChange={handleChange} className='form-control' type="password" placeholder='Password'></input>
                <p style={{ color: "red", textAlign: "left", fontSize: "smaller" }}>{err}</p>
              </div>
              <div className='d-grid'>
                <button className='btn' type="submit" style={{ backgroundColor: '#031e30', color: 'white' }}>Login</button>
              </div>
            </form>
          </div>


        </div >
      </div >
    </>
  );
}

export default Login
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@reach/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import './Profile.css'
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import "../API/api"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/src/modal'
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const basedata = {
  Name: "",
  Description: "",
  Validdate: "",
  Files: ""
}

export default function Sidebar2() {
  const [pushpopup, setPushpopup] = useState(false)
  const [successUp, setSuccessUp] = useState(false)
  const [imagepop, setImagepop] = useState(false)
  const dataFetchedRef = useRef(false);
  const [data, setData] = useState([]);
  const [profile, setProfile] = useState(null)
  const [employeeImg, setEmployeeImg] = useState();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [validdate, setValiddate] = useState('');
  const [files, setFiles] = useState([])

  const [NotificationArray, setNotificationArray] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const Id = window.localStorage.getItem("ADMIN_ID")
    setEmployeeImg(Id)
  }, [])

  const routeEmployeePage = () => {
    navigate("/profilepage/addemployee")
  }
  const routeBillingPage = () => {
    navigate("/profilepage/billing")
  }

  const routeAssignPage = () => {
    navigate("/profilepage/assignproject")
  }
  const routeAdminAccessPage = () => {
    navigate("/profilepage/employeeRole")
  }

  const getDetails = (e) => {
    axios.get(`${global.API_URL}/smg/admin/getAdminDetails/${window.localStorage.getItem("ADMIN_ID")}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        setData((res.data));
      }).catch((error) => {
        console.log("Some error here", error);
        if (error.message == 'Request failed with status code 401') {
          toast.warning("Session Expired");
          navigate("/")
        }
      })
  }

  const pushNotification = (e) => {
    e.preventDefault()
    setNotificationArray([...NotificationArray, {
      Name: name,
      Description: description,
      Validdate: validdate,
      Files: files
    }])
    setName("");
    setDescription("");
    setValiddate("");
    setFiles([])
    navigate("employeelist")
  }

  // NotificationsIcon related code // ->

  if ((NotificationArray.length) > 0) {
    const updated_counter = document.querySelector(".bell-notification");
    updated_counter.setAttribute("current-count", (NotificationArray.length))
  }

  window.localStorage.setItem("NotificationArray", JSON.stringify(NotificationArray))

  //  NotificationsIcon related code // <-

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getDetails()
  }, []);

  const handleFile = (e) => {
    setFiles(...files, e.target.files);
  }

  const handleDelete = index => {
    setFiles(files.filter((file, i) => i !== index));
  };

  const zoomImage = () => {
    setSuccessUp(true)
  }

  const openNotification = () => {
    setPushpopup(true)
  }
  const handleSuccessClose = () => {
    setSuccessUp(false)
  }

  const openNotifyscreen = () => {
    setPushpopup(false)
  }

  const EditImage = () => {
    setImagepop(true)
    setSuccessUp(false)
  }
  const openImagescreen = () => {
    setImagepop(false)
    setSuccessUp(true)
    setPushpopup(false)
  }

  const inputhandle = (e) => {
    setProfile(e.target.files[0]);
  }

  const uploadImage = (e) => {
    e.preventDefault();
    const profileData = new FormData();
    profileData.append('employeeImage', profile)

    axios.put(`${global.API_URL}/smg/employee/updateEmpPhoto/${window.localStorage.getItem("ADMIN_ID")}`, profileData, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        toast("Profile Updated Successfully")
        setInterval(() => {
          window.location.reload(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      })
  }

  return (
    <div className="View">
      <Dialog
        isOpen={imagepop}
        onDismiss={openImagescreen}
        className="dialogboxImage"

      >
        <div className="close-button">
          <IconButton onClick={openImagescreen} title='Back'>
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Tabs>
          <TabPanels className="contentDetails">
            <TabPanel>
              <div className='d-flex'>
                <input type='file' className='form-control w-75 me-2' onChange={inputhandle} />
                <button className='btn btn-outline-success' type='submit' onClick={uploadImage}>Upload</button>
              </div>

            </TabPanel>
          </TabPanels>
        </Tabs>
      </Dialog>

      {/* Notificatin popup */}
      <Dialog
        isOpen={pushpopup}
        onDismiss={openNotifyscreen}
        className="dialogboxImage"

      >
        <div className="close-button">
          <IconButton onClick={openNotifyscreen}>
            <CloseIcon />
          </IconButton>
        </div>

        <Tabs>
          <TabPanels className="contentDetails">
            <TabPanel>
              <form onSubmit={pushNotification}>
                <label>Name</label>
                <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} className='form-control' />
                <label>Description</label>
                <textarea className="form-control" rows="3" type='text' name='description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <label>Validate</label>
                <input type='date' name='validdate' value={validdate} onChange={(e) => setValiddate(e.target.value)} className='form-control' />
                <label>Upload FIle</label>
                <input type='file' onChange={handleFile} multiple className='form-control' />
                <div>
                  {files.map((file, index) => (
                    <div key={index} target='_blank'>
                      {file.name}
                      <span className='bi bi-trash3-fill' style={{ float: 'right' }} type="button" onClick={() => handleDelete(index)}>

                      </span>
                    </div>
                  ))}
                </div>
                <button type='submit' className='btn btn-outline-dark mt-2'>Submit</button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Dialog>
      <div className="complete-sidebar2">
        <div className="complete-sidebar3">
          <img src="https://smartgiginternalfrontend.s3.ap-south-1.amazonaws.com/SG+LOGO+2.png" alt="img" />

          <div className='side1'>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className='side2'>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        <div className="sidebar-map">
          <div key={data.Sidebar2} className="sidebar-text">
            <label>
              <Tooltip title="View">
                <img src={data.image} alt="img" onClick={zoomImage} />
              </Tooltip>
              {data.name}
              <Dialog
                isOpen={successUp}
                onDismiss={handleSuccessClose}
                className="dialogbox"
              >
                <div className="close-button">
                  <IconButton onClick={handleSuccessClose}>
                    <CloseIcon />
                  </IconButton>
                </div>

                <Tabs>
                  <TabPanels className="contentDetails">
                    <TabPanel>
                      <img
                        src={data.image}
                        alt="img"
                        height='450'
                        style={{ width: "100%" }}
                      />
                      <div className='bi bi-camera EDIcons' onClick={EditImage}>Edit</div>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Dialog>
            </label>
            <span> [{data.designation}] </span>
          </div>
          <div className="Icons">
            <span onClick={openNotification}><NotificationsActiveIcon
              style={{
                fontSize: "25px",
                marginTop: "-3px",
                marginRight: "5px",
              }}
            />  Push Notification</span>
            <span onClick={routeAdminAccessPage}>
              <AdminPanelSettingsIcon
                style={{
                  fontSize: "25px",
                  marginTop: "-3px",
                  marginRight: "5px",
                }}
              />
              Admin Access
            </span>
            <span onClick={routeEmployeePage}>
              <GroupAddIcon
                style={{
                  fontSize: "25px",
                  marginTop: "-3px",
                  marginRight: "5px",
                }}
              />
              Add Employee{" "}
            </span>
            <span onClick={routeAssignPage}>
              <LibraryBooksSharpIcon style={{ marginRight: "5px" }} />
              Assigned Project{" "}
            </span>
            <span onClick={routeBillingPage}>
              <AttachMoneyIcon />
              Billing
            </span>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

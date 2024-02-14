import axios from 'axios';
import React, {useState, useEffect } from 'react'
import './Profile.css'
import "../API/api"
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Dialog } from '@reach/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { toast } from 'react-toastify';

export default function Sidebar2() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [successUp, setSuccessUp] = useState(false)


    useEffect(() => {
        getDetails()
    }, []);

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
                    navigate("/");
                }
            })
    }

    const zoomImage = ()=>{
        setSuccessUp(true)
      }
     const handleSuccessClose =()=>{
         setSuccessUp(false)
     }

    return (
        <div className='View'>
            <div className='complete-sidebar2'>
                {

                    <div className="sidebar-map">

                        <div key={data.Sidebar2} className='sidebar-text'>
                            <label>
                            <Tooltip title="View">
                                <img src={data.image} alt="img"  onClick={zoomImage}/>
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
                      <Tooltip title='Edit'>
                      <div className='bi bi-camera EDIcons' >Edit</div>  
                      </Tooltip>   
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Dialog>
                            </label>
                            <span> [{data.designation}] </span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

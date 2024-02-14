import React, { useEffect, useState } from 'react'
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { Link, useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';
import { toast } from 'react-toastify';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Tooltip from '@mui/material/Tooltip';
import LaptopIcon from '@mui/icons-material/Laptop';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Sidebar1() {
    const [switchrole, setSwitchrole] = useState("");
    const navigate = useNavigate();

    const routeEmployeeList = () => {
        navigate("/profilepage/employeelist")
    }
    const routeBillingPage = () => {
        navigate("/profilepage/clientbilling") //
    }
    // const routeClientPage = () => {
    //     navigate(
    // }
    const handleLogout = () => {
        window.localStorage.clear();
        toast.warning("Logged out")
        navigate("/");
    }
    const handlePiechart = () => {
        navigate("/profilepage/piechart");
    }

    const handleProfit = () => {
        navigate("/profilepage/profit&l");
    }

    const HandleSwitch = (e) => {
        setSwitchrole(e.target.value)
    }


    const routeHike = () => {
        navigate("/profilepage/hikeeligible")
    }

    if (switchrole) {
        switch (switchrole) {
            case 'Admin':
                navigate("/profilepage/employeelist");
                setSwitchrole("");
                break;
            case "HR":
                navigate("/hrProfile/candidatelist");
                setSwitchrole("");
                break;
            case "Employee":
                navigate("/employeeProfile/applyLeave");
                setSwitchrole("");
                break;
        }
    }

    // NotificationsIcon related code

    const openNotification = () => {
        navigate("notification");
    }

    let NotiArr = (JSON.parse(window.localStorage.getItem("NotificationArray")));

    return (
        <>
            <div className='sidebar1'>

                {(localStorage.getItem("ROLE_OF_ADMIN") == "SUPER_ADMIN")
                    ?
                    (<div className='profIconsBg'>
                        <select className='form-select p-1' name='switchrole' value={switchrole} onChange={HandleSwitch}>
                            <option >Admin</option>
                            <option>HR</option>
                            <option>Employee</option>
                        </select>
                    </div>

                    )
                    :
                    ("")
                }

                <div onClick={openNotification} className='bell-notification' current-count="" >
                    < NotificationsIcon />
                </div>

                {/* {
                    (NotiArr.length > 0)
                        ?
                        <div onClick={openNotification} className='bell-notification' current-count="" >
                            < NotificationsIcon />
                        </div>
                        :
                        <div onClick={openNotification} className='bell-notification' current-count="" >
                            < NotificationsIcon />
                        </div>
                } */}

                <div className='profIconsBg'>
                    <PeopleIcon onClick={routeEmployeeList} className='profIcons' />
                    <span>Employee</span>
                </div>
                <ul className='profIconsBg'>
                    <li><LaptopIcon />
                        <ul id='texteffects'>
                            <li><Link to="/profilepage/laptopadd">Laptop</Link></li>
                            <li><Link to="/profilepage/employeelaptop" >Assigned Laptop</Link></li>
                        </ul>
                    </li>
                </ul>
                <div className='profIconsBg'>
                    <PlaylistAddIcon onClick={routeHike} className='profIcons' />
                    <span>Hike Eligible Employee</span>
                </div>
                <div className='profIconsBg'>
                    <AttachMoneyIcon onClick={routeBillingPage} className='profIcons' />
                    <span>Client Billing</span>
                </div>
                <ul className='profIconsBg'>
                    <li><LibraryBooksSharpIcon />
                        <ul >
                            <li><Link to="/profilepage/clientform">Client</Link></li>
                            <li><Link to="/profilepage/projectform">Project</Link></li>
                        </ul>
                    </li>
                </ul>


                <div className='profIconsBg'>
                    <DonutSmallTwoToneIcon onClick={handlePiechart} className='profIcons' />
                    <span>Expense</span>
                </div>
                <div className='profIconsBg'>
                    <EqualizerIcon onClick={handleProfit} className='profIcons' />
                    <span>P & L</span>
                </div>
                {/* <div className='profIconsBg'>
                    <VideoChatIcon onClick={handleMeeting} className='profIcons' />
                    <span>Zoom Meeting</span>
                </div> */}
                <div className='profIconsBg'>
                    <LogoutSharpIcon onClick={handleLogout} className='profIcons' />
                    <span>Logout</span>
                </div>

            </div>

        </>
    )
}

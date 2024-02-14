import React, { useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Tooltip from '@mui/material/Tooltip';



export default function EmpSidebar1() {
    const [switchrole, setSwitchrole] = useState("");
    const navigate = useNavigate();

    const HandleSwitch = (e) => {
        setSwitchrole(e.target.value)
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
                navigate("/employeeProfile");
                setSwitchrole("");
                break;
        }
    }

    const routeCalender = () => {
        navigate("/employeeProfile/applyLeave")
    }

    const routeHistory = () => {
        navigate("/employeeProfile/leavehistory")
    }
    const routePaySlip = () => {
        navigate("/employeeProfile/paySlip")
    }

    const handleLogout = () => {
        window.localStorage.clear();
        navigate("/");
    }

    return (
        <div className='sidebar1'>
            {(localStorage.getItem("ROLE_OF_ADMIN") == "SUPER_ADMIN")
                ?
                (<div className='profIconsBg'>
                    <select className='form-select p-1' name='switchrole' value={switchrole} onChange={HandleSwitch}>
                        <option > Employee </option>
                        <option > Admin</option>
                        <option > HR </option>
                    </select>
                </div>)
                :
                ("")
            }
            <div className='profIconsBg'>
                <CalendarMonthIcon onClick={routeCalender} className='profIcons' />
                <span>Apply Leave</span>
            </div>
            <div className='profIconsBg'>
                <PlaylistAddIcon onClick={routeHistory} className='profIcons' />
                <span>Leave History</span>
            </div>
            <div className='profIconsBg'>
                <ReceiptIcon onClick={routePaySlip} className='profIcons' />
                <span>Pay Slip</span>
            </div>
            <div className='profIconsBg'>
                <LogoutSharpIcon onClick={handleLogout} className='profIcons' />
                <span>Logout</span>
            </div>
        </div>
    )
}

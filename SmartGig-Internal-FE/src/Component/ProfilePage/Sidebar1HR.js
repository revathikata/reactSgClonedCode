import React, { useState } from 'react'
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Sidebar1() {
    const navigate = useNavigate();
    const [switchrole, setSwitchrole] = useState("");

    const handleLogout = () => {
        window.localStorage.clear();
        navigate("/");
    }
    const handleList = () => {
        navigate("/hrProfile/candidatelist")
    }

    const addCandidate = () => {
        navigate('/hrProfile/candidateform')
    }

    const interviewList = () => {
        navigate('/hrProfile/interviewlist')
    }

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
                navigate("/employeeProfile/applyLeave");
                setSwitchrole("");
                break;
        }
    }

    const openNotification = () => {
        navigate("notification");
    }

    return (
        <>
            <div className='sidebar1'>
                {(localStorage.getItem("ROLE_OF_ADMIN") == "SUPER_ADMIN")
                    ?
                    (<div className='profIconsBg'>
                        <select className='form-select p-1' name='switchrole' value={switchrole} onChange={HandleSwitch}>
                            <option >HR</option>
                            <option >Admin</option>
                            <option >Employee</option>
                        </select>
                    </div>)
                    :
                    ("")
                }

                <div onClick={openNotification} className='bell-notification' current-count="" >
                    < NotificationsIcon />
                </div>

                <div className='profIconsBg'>
                    <PlaylistAddIcon onClick={handleList} className='profIcons' />
                    <span>Candidate List</span>
                </div>
                <div className='profIconsBg'>
                    <GroupAddIcon onClick={addCandidate} className='profIcons' />
                    <span>Add Candidate</span>
                </div>
                <div className='profIconsBg'>
                    <AssignmentTurnedInIcon onClick={interviewList} className='profIcons' />
                    <span>Interview List</span>
                </div>
                <div className='profIconsBg'>
                    <LogoutSharpIcon onClick={handleLogout} className='profIcons' />
                    <span>Logout</span>
                </div>

            </div>
        </>
    )
}

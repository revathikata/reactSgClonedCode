import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../ProfilePage/Profile.css'
import "../API/api"
import { toast } from 'react-toastify';

export default function EmpSidebar2() {

    const [data, setData] = React.useState([]);
    const navigate = useNavigate();

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

    return (
        <div className='View'>
            <div className='complete-sidebar2'>
                {

                    <div className="sidebar-map">

                        <div key={data.Sidebar2} className='sidebar-text'>
                            <label>
                                <img src={data.image} alt="" />
                                {data.name}
                            </label>
                            <span> [{data.designation}] </span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

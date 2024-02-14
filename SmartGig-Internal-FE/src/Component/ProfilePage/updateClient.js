import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Profile.css'
import { useNavigate, useParams } from 'react-router-dom';
import "../API/api"
import { toast } from 'react-toastify';
import { set } from 'lodash';


export default function UpdateClient() {
    const params = useParams()
    const [clientName, setClientName] = useState('');
    const [location, setLocation] = useState('')
    const [status, setStatus] = useState('')
    const [address, setAddress] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [emailId, setEmailId] = useState('')
    const [gst, setGst] = useState('')
    const [spocName, setSpocName] = useState('')
   

    const navigate = useNavigate();

    const handleUpdateClient = (e) => {
        e.preventDefault();
        axios.put(`${global.API_URL}/smg/client/editClientDetails/${params.id}`, {
            clientName: clientName,
            location: location,
            status: status,
            address:address,
            contactNumber:contactNumber,
            emailId:emailId,
            gst:gst,
            spocName:spocName
        }, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
                console.log("successfully client details updated", res);
                    navigate("/profilepage/clientform")
                    toast.success("Client details updated")
            })
            .catch((err) => {
                console.log("error found", err);
            })
    }

    const handleReset = ()=>{
        navigate("/profilepage/clientform")
    }
    useEffect(() => {
        const GetClientDetails = async () => {
            await axios.get(`${global.API_URL}/smg/client/getClientDetails/${params.id}
            `, {
              headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
              }
            }).then((res) => {
                setClientName(res.data.clientName)
                setLocation(res.data.location)
                setStatus(res.data.status)
                setAddress(res.data.address)
                setContactNumber(res.data.contactNumber)
                setEmailId(res.data.emailId)
                setGst(res.data.gst)
                setSpocName(res.data.spocName)
            }).catch((err) => {
              console.log("some error", err);
            })
          }
          GetClientDetails()
    }, [])

    return (
        <div>
            <form onSubmit={handleUpdateClient}>
                <h5>Update Client</h5>
                <div className='container mainWrapper'>
                    <div className='innerone'>
                        <label className='form-label'>Client Name</label>
                        <input type="text" value={clientName} name="clientName" onChange={(e) => setClientName(e.target.value)} className='form-control w-75 '  />
                        <label className='form-label'>Client Location</label>
                        <input type="text" value={location} name="location" onChange={(e) => setLocation(e.target.value)} className='form-control w-75'  />
                        <label className='form-label'>GST No</label>
                        <input type="text" value={gst} name="gst" onChange={(e) => setGst(e.target.value)} className='form-control w-75'  />
                    </div>
                    <div className='innerone'>
                        <label className='form-label'>Address</label>
                        <input type="text" value={address} name="address" onChange={(e) => setAddress(e.target.value)} className='form-control w-75'  />
                        <label className='form-label'>SPOC Name</label>
                        <input type="text" value={spocName} name="spocName" onChange={(e) => setSpocName(e.target.value)} className='form-control w-75'  />
                        <label className='form-label'>Email_Id</label>
                        <input type="text" value={emailId} name="emailId" onChange={(e) => setEmailId(e.target.value)} className='form-control w-75'  />
                    </div>

                    <div className='innerone'>
                        <label className='form-label'>Contact No</label>
                        <input type="text" value={contactNumber} name="contactNumber" onChange={(e) => setContactNumber(e.target.value)} className='form-control w-75' />
                        <button type='submit' className='btn btn-success  Btn me-3'>Update Client</button>
                        <button type='submit' className='btn btn-warning  Btn' onClick={handleReset}>Reset</button>
                     </div>
                    
                </div>
            </form>
        </div>
    )
}

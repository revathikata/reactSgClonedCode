import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "../API/api"
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const laptopinitialData = {

    id: null,
    laptopId: null,
    serialno: "",
    dateOfIssue: "",
    returnedOn: "",
    replaceOn: "",
}

const EditLaptop = () => {
    const [laptopData, setLaptopData] = useState(laptopinitialData)
    const [employeeDetailsId, setEmployeeDetailsId] = useState(null)

    const [status, setStatus] = useState(true);
    const [returnstatus, setReturnStatus] = useState();
    const [screen, setScreen] = useState(false);
    // const [error, setError] = useState(false)

    const { id, laptopId, serialno, replaceOn, dateOfIssue, returnedOn } = laptopData
    const navigate = useNavigate()


    useEffect(() => {
        const employeeId = window.localStorage.getItem("EDIT_ID")
        setEmployeeDetailsId(employeeId)

        setLaptopData({
            id: window.localStorage.getItem("ID_FOR_LAPTOP"),
            laptopId: window.localStorage.getItem("LAPTOP_ID_FOR_LAPTOP"),
            serialno: window.localStorage.getItem("SERIAL_NO"),
            dateOfIssue: ((window.localStorage.getItem("ISSUE_DATE")) == "null") ? window.localStorage.getItem("ISSUE_DATE") : moment(window.localStorage.getItem("ISSUE_DATE")).format('YYYY-MM-DD'),
            returnedOn: ((window.localStorage.getItem("RETURN_DATE")) == "null") ? window.localStorage.getItem("RETURN_DATE") : moment(window.localStorage.getItem("RETURN_DATE")).format('YYYY-MM-DD'),
            replaceOn: ((window.localStorage.getItem("REPLACE_DATE")) == "null") ? window.localStorage.getItem("REPLACE_DATE") : moment(window.localStorage.getItem("REPLACE_DATE")).format('YYYY-MM-DD'),
            // status: false
        })
    }, [])

    const handlelaptopValues = (e) => {
        setLaptopData({
            ...laptopData,
            [e.target.name]: [e.target.value],
        })
    }

    const handleReturnLaptop = (e) => {
        setStatus(e.target.value)
        if (document.getElementById("Status").value == "Yes") {
            setReturnStatus(true);
            setScreen(true);
        }
        else if (document.getElementById("Status").value == "No") {
            setReturnStatus(false);
            setScreen(false);
        }
    }

    const EditLaptopDetails = (e) => {
        e.preventDefault()
        // if (status) {
        //     setError(true);
        //     return false;
        // }
        axios.put(`${global.API_URL}/smg/assignedLap/editAssignedLaptops`, {
            employeeDetailsId: `${employeeDetailsId}`,
            id: `${id}`,
            laptopId: `${laptopId}`,
            issueDate: `${dateOfIssue}`,
            replaceDate: `${replaceOn}`,
            returnStatus: `${returnstatus}`,
            returnDate: `${returnedOn}`,
        }, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((response) => {
            toast.success("Details Updated Successfully")
            navigate("/profilepage/employeelist")
        }).catch((err) => {
            toast.error("Something went wrong")
        })
    }
    const handleCancel = () => {
        navigate("/profilepage/employeelist")
    }

    return (
        <div className='container'>
            <h5>Laptop Details</h5>
            <form className="upload--container" onSubmit={EditLaptopDetails}>
                <div className='mainWrapper'>
                    <div className='inneroneD'>
                        <div>
                            <label className='form-label'> Serial No </label>
                            <input type="text" name='serialno' value={serialno} onChange={handlelaptopValues} className='form-control w-50' placeholder='Enter serial no' />
                        </div>
                        <div>
                            <label className='form-label'>Issue Date</label>
                            <input type="date" name='dateOfIssue' value={dateOfIssue} onChange={handlelaptopValues} className='form-control w-50' />

                        </div>


                    </div>
                    <div className='inneroneD'>
                        <div>
                            <label className='form-label'>Replace Date </label>
                            <input type="date" name='replaceOn' value={replaceOn} onChange={handlelaptopValues} className='form-control w-50' />
                        </div>
                        <div>
                            <label className='form-label'>Return Status </label>
                            <select className='form-select w-50' name="status" id="Status" value={status} onChange={handleReturnLaptop}>
                                <option>
                                    No
                                </option>
                                <option>
                                    Yes
                                </option>
                            </select>
                            {/* {error && !status && <p className='errormsg'>Please Select Status</p>} */}

                        </div>
                        {(screen) ? (<div>
                            <label className='form-label'>Returned Date </label>
                            <input type="date" name='returnedOn' value={returnedOn} onChange={handlelaptopValues} className='form-control w-50' />
                        </div>) : ""}
                        <div className='FormbtngroupHL'>
                            <button className='btn me-2' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                            <button className='btn fw-bold' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>

                </div>

            </form>
        </div>
    );
}

export default EditLaptop;

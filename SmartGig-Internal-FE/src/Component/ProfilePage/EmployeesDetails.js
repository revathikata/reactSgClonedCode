import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { Dialog } from '@reach/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../API/api"

const initialData = {
    fullName: "",
    gender: "",
    dateOfJoining: "",
    primaryLocation: "",
    currentLocation: "",
    qualification: "",
    primarySkills: "",
    secondrySkills: "",
    dateOfBirth: "",
    dateOfMarriage: "",
    degination: "",
    role: "",
    empType: "",
    status: true,
    lastWorkingDay: "",
    experience: 0,
    fixedctc: 0,
    variablepay: 0,
    ctc: 0,
    email: "",
    mobileNo: "",
    alternateMobile: "",
    UAN: "",
    hiredAs: ""
}
const EmployeesDetails = () => {
    const [NameFail, setNameFail] = useState(false);
    const [presentname, setPresentname] = useState([]);
    const [excelimport, setExcelimport] = useState(null)
    const [roleofemp, setRoleofemp] = useState([])
    const [data, setData] = useState(initialData);
    const [ctc, setCtc] = useState(initialData.ctc);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const {
        fullName,
        gender,
        dateOfJoining,
        primaryLocation,
        currentLocation,
        qualification,
        primarySkills,
        secondrySkills,
        dateOfBirth,
        dateOfMarriage,
        degination,
        role,
        empType,
        lastWorkingDay,
        experience,
        variablepay,
        fixedctc,
        email,
        mobileNo,
        alternateMobile,
        UAN,
        hiredAs } = data

    const inputHandle = (e) => {
        setData({
            ...data,
            [e.target.name]: [e.target.value],
        })
    }

    const inputHandleVarPay = (e) => {
        setData({
            ...data,
            [e.target.name]: [e.target.value],
        })
        handleCTC();
    }

    const inputHandleCtc = (e) => {
        setCtc(e.target.value)
    }

    const handleCTC = () => {
        let fctc = document.getElementById("fixedctc").value;
        let varpy = document.getElementById("varpay").value;
        var newctc = parseInt(fctc) + parseInt(varpy);
        setCtc(newctc);
    }

    const allRoles = () => {
        axios.get(`${global.API_URL}/smg/candidate/getAllrole`, {
            headers: {

                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((response) => {
            setRoleofemp(response.data)
        }).catch((error) => {
            console.log("error while fetching data", error)
        })
    }

    useEffect(() => {
        allRoles()
    }, [])
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!fullName || !email || !mobileNo || !empType || !degination || !role || !qualification || !primarySkills || !primaryLocation || !experience || !variablepay || !fixedctc || !dateOfJoining || !ctc || !hiredAs) {
            setError(true);
            return false;
        }


        axios.post(`${global.API_URL}/smg/employee/saveEmployeeDetails`, {
            // employeeDetailsId: `${ employeeDetailsId }`,
            fullName: `${fullName}`,
            // empId: "0",
            gender: `${gender}`,
            dateOfJoining: `${dateOfJoining}`,
            primaryLocation: `${primaryLocation}`,
            currentLocation: `${currentLocation}`,
            qualification: `${qualification}`,
            primarySkills: `${primarySkills}`,
            secondrySkills: `${secondrySkills}`,
            dateOfBirth: `${dateOfBirth}`,
            dateOfMarriage: `${dateOfMarriage}`,
            ctc: `${ctc}`,
            degination: `${degination}`,
            role: `${role}`,
            empType: `${empType}`,
            status: true,
            lastWorkingDay: `${lastWorkingDay}`,
            password: "smartgig@123",
            accessRole: "EMPLOYEE",
            changePassword: false,
            exp: `${experience}`,
            fixedCtc: `${fixedctc}`,
            variablePay: `${variablepay}`,
            email: `${email}`,
            mobileNo: `${mobileNo}`,
            alternateMobile: `${alternateMobile}`,
            UAN: `${UAN}`,
            hiredAs: `${hiredAs}`
        }, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                console.log("data stored", res);
                const empId = res.data.empId
                window.localStorage.setItem("EMP_ID_FOR_DOCUMENT", empId)

                if (res.data.msg == "this name already presnt") {
                    toast.error("Employee Name is already exist");
                }
                if (res.data.msg == 'this email id already present') {
                    toast.error("Email is already exist");
                }
                else if (res.data.msg == "this mobile number already present") {
                    toast.error("Mobile Number is already exist");
                }
                else if (res.data.msg == "data saved") {
                    toast.success("Employee Details Added Successfully");
                    navigate('/profilepage/documents')
                }
            }).catch((error) => {
                console.log("Error found", error)
            })
    }

    const handleCancel = () => {
        navigate("/profilepage/employeelist")
    }


    const handleExcelImport = (e) => {
        console.log(e.target.files)
        setExcelimport(e.target.files[0])
    }
    const importFile = (e) => {
        e.preventDefault();
        const excelData = new FormData();
        excelData.append('excel', excelimport)

        axios.post(`${global.API_URL}/smg/employee/empBulkUpload`, excelData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                console.log("already present", res)
                setPresentname(res.data)
                if (res.data.empName == "") {
                    toast.success("File Uploaded Successfully")
                    navigate("/profilepage/employeelist")
                } else {
                    setNameFail(true)
                }

            })
            .catch((error) => {
                console.log("some error during  uplaod", error);
            })
    }

    const handleClose = () => {
        setNameFail(false);
    }
    return (
        <div>
            <div className='d-flex mb-2'>
                <input type='file' onChange={handleExcelImport} className='form-control w-25 me-2' />
                <button className='btn btn-success' type='submit' onClick={importFile}>Import Excel Data</button>
            </div>
            <Dialog isOpen={NameFail} onDismiss={handleClose} className="dialogbox" >
                <div className='close-button'>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <Tabs>
                    <TabList className="tabsnav">
                        <Tab>May be below employees already exists Please Check</Tab>
                    </TabList>
                    <TabPanels className="contentDetails">
                        <TabPanel>
                            <div>
                                {
                                    presentname.map((emp, index) => {
                                        return <div className='d-flex p-2' key={index}><h6>Name</h6> : <div className='ms-5' >{emp.empName}</div></div>
                                    })
                                }
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Dialog>
            <hr />
            <form onSubmit={handleSubmitForm}>
                <div className='mainWrapper'>
                    <div className='innerone'>

                        <label className='form-label'> Full Name <sup className='star'>*</sup></label>
                        <input type="text" onChange={inputHandle} value={fullName} name="fullName" className="form-control w-75" id="pwd" placeholder='Enter Full Name' />
                        {error && !fullName && <p className='errormsg'>Please Enter Name</p>}


                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Gender <sup className='star'>*</sup></label>
                                <select className='gnder form-select w-75' onChange={inputHandle} value={gender} name="gender" >
                                    <option>
                                    </option>
                                    <option>
                                        Male
                                    </option>
                                    <option>
                                        Female
                                    </option>
                                </select>
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>DOB <sup className='star'>*</sup></label>
                                <input type="date" onChange={inputHandle} value={dateOfBirth} name="dateOfBirth" className="form-control w-75" id="pwd" />
                            </div>
                        </div>
                        <label className='form-label'> Email Id <sup className='star'>*</sup></label>
                        <input type="email" onChange={inputHandle} value={email} name="email" className="form-control w-75" id="pwd" placeholder='Enter Email  Id' />
                        {error && !email && <p className='errormsg'>Please Enter email</p>}


                        <label className='form-label'>Mobile No <sup className='star'>*</sup></label>
                        <input type="text" onChange={inputHandle} value={mobileNo} name="mobileNo" className="form-control w-75" placeholder='Enter mobile no' />
                        {error && !mobileNo && <p className='errormsg'>Please Enter mobile number</p>}

                        <label className='form-label'> Alternate Mobile No </label>
                        <input type="text" onChange={inputHandle} value={alternateMobile} name="alternateMobile" className="form-control w-75" placeholder='Enter alternate no' />

                        <label className='form-label'>Employee Type <sup className='star'>*</sup></label>
                        <select className='detailsType form-select w-75' onChange={inputHandle} value={empType} name="empType">
                            <option></option>
                            <option>Intern</option>
                            <option>Full Time</option>
                            <option>Part Time</option>
                        </select>
                        {error && !empType && <p className='errormsg'>Please Select Employee Type</p>}
                        <label className='form-label'>Designation <sup className='star'>*</sup></label>
                        <select onChange={inputHandle} value={degination} name="degination" className="form-select w-75">
                            <option></option>
                            <option>CEO</option>
                            <option>Associate HR Manager</option>
                            <option>Associate Manager</option>
                            <option>HR Executive</option>
                            <option>Senior HR Executive</option>
                            <option>HR Lead Analyst	</option>
                            <option>HR Manager</option>
                            <option>Senior HR Manager</option>
                            <option>Manager</option>
                            <option>Finance Manager</option>
                            <option>Software Consultant</option>
                            <option>Senior Manager</option>
                            <option>Senior Software Consultant</option>
                            <option>Software Lead Consultant</option>
                        </select>
                        {error && !degination && <p className='errormsg'>Please Select designation</p>}
                    </div>

                    <div className='innerone'>

                        <label className='form-label'> Hired For <sup className='star'>*</sup></label>
                        <select className='detailsType form-select w-75' onChange={inputHandle} value={hiredAs} name="hiredAs">
                            <option></option>
                            <option>Internal</option>
                            <option>External</option>
                            <option>Contract</option>
                        </select>
                        {error && !hiredAs && <p className='errormsg'>Please Select Employee Hired As</p>}

                        <label className='form-label'>Role<sup className='star'>*</sup></label>
                        <select onChange={inputHandle} value={role} name="role" className="form-select w-75">
                            {/* <option></option> */}
                            {
                                roleofemp.map((list, index) => {
                                    return <option key={index}>{list}</option>
                                })
                            }
                        </select >
                        {error && !role && <p className='errormsg'>Please select role</p>}
                        <label className='form-label'>Qualification <sup className='star'>*</sup></label>
                        <select type="text" onChange={inputHandle} value={qualification} name="qualification" className="form-select w-75">
                            <option></option>
                            <option>UG</option>
                            <option>PG</option>
                        </select>
                        {error && !qualification && <p className='errormsg'>Please select qualification</p>}
                        <label className='form-label'>Primary Skills</label>
                        <select onChange={inputHandle} value={primarySkills} name="primarySkills" className="form-select w-75">
                            <option></option>
                            <option>Angular</option>
                            <option>AWS/Cloud</option>
                            <option>C/C++</option>
                            <option>Client handling</option>
                            <option>Decision Making</option>
                            <option>DOT NET</option>
                            <option>Flutter/Dart</option>
                            <option>IOS</option>
                            <option>Java/Spring Boot</option>
                            <option>JavaScript/ReactJs</option>
                            <option>Kotlin</option>
                            <option>MongoDB</option>
                            <option>MySQL</option>
                            <option>Node.Js/Express</option>
                            <option>PHP/Laravel</option>
                            <option>Python/Django</option>
                            <option>R</option>
                            <option>Ruby</option>
                            <option>Recruitment</option>
                            <option>Swift</option>
                            <option>Salary Negotiation</option>
                            <option>Talent acquisition</option>
                            <option>UI/UX</option>
                            <option>Vendor Management</option>
                            <option>Vue Js</option>
                        </select>
                        {error && !primarySkills && <p className='errormsg'>Please Select Skills</p>}

                        <label className='form-label'>Secondary Skills </label>
                        <select onChange={inputHandle} value={secondrySkills} name="secondrySkills" className="form-select w-75" id="pwd" placeholder='Enter Your Secondary Skills'>
                            <option></option>
                            <option>Angular</option>
                            <option>AWS</option>
                            <option>C/C++</option>
                            <option>Client handling</option>
                            <option>Decision Making</option>
                            <option>DOT NET</option>
                            <option>Flutter/Dart</option>
                            <option>IOS</option>
                            <option>Java/Spring Boot</option>
                            <option>JavaScript/ReactJs</option>
                            <option>Kotlin</option>
                            <option>MongoDB</option>
                            <option>MySQL</option>
                            <option>Node.Js/Express</option>
                            <option>PHP/Laravel</option>
                            <option>Python/Django</option>
                            <option>R</option>
                            <option>Ruby</option>
                            <option>Recruitment</option>
                            <option>Swift</option>
                            <option>Salary Negotiation</option>
                            <option>Talent acquisition</option>
                            <option>UI/UX</option>
                            <option>Vendor Management</option>
                            <option>Vue Js</option>
                        </select>
                        <label className='form-label'>Work Location <sup className='star'>*</sup></label>
                        <select onChange={inputHandle} value={primaryLocation} name="primaryLocation" className="form-select w-75">
                            <option></option>
                            <option>Bangalore</option>
                            <option>Hyderabad</option>
                            <option>Tirupati</option>
                        </select>
                        {error && !primaryLocation && <p className='errormsg'>Please Enter location</p>}
                        <label className='form-label'>Current Location<sup className='star'>*</sup></label>
                        <input type="text" onChange={inputHandle} value={currentLocation} name="currentLocation" className="form-control w-75" id="pwd" placeholder='Enter Current Location' />

                    </div>
                    <div className='innerone'>


                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>DOJ</label>
                                <input type="date" className="form-control w-75" id="pwd" name="dateOfJoining" onChange={inputHandle} value={dateOfJoining} />
                                {error && !dateOfJoining && <p className='errormsg'>Please Enter date</p>}
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>DOM</label>
                                <input type="date" onChange={inputHandle} value={dateOfMarriage} name="dateOfMarriage" className="form-control w-75" id="pwd" />

                            </div>
                        </div>
                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Last Working Day </label>
                                <input type="date" onChange={inputHandle} value={lastWorkingDay} name="lastWorkingDay" className="form-control w-75" id="pwd"  />
                            </div>
                        </div>
                        <div className='inneronerow'>
                            <label className='form-label'> Total Experience <sup className='star'>*</sup></label>
                            <input type="text" onChange={inputHandle} value={experience} name="experience" className="form-control w-75" id="pwd"  />
                            {error && !ctc && <p className='errormsg'>Please Enter Total Experience</p>}
                        </div>
                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Fixed CTC <sup className='star'>*</sup></label>
                                <input type="text" onChange={inputHandleVarPay} value={fixedctc} name="fixedctc" className="form-control w-75" id="fixedctc"  />
                                {error && !ctc && <p className='errormsg'>Please Enter Fixed CTC</p>}
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>Variable pay <sup className='star'>*</sup></label>
                                <input type="text" onChange={inputHandleVarPay} value={variablepay} name="variablepay" className="form-control w-75" id="varpay" />
                                {error && !ctc && <p className='errormsg'>Please Enter Variable pay</p>}
                            </div>
                        </div>
                        <div className='inneronerow'>
                            <label className='form-label'> Total CTC <sup className='star'>*</sup></label>
                            <input type="text" onChange={inputHandleCtc} value={ctc} name="ctc" className="form-control w-75" id="totalctc"/>
                            {error && !ctc && <p className='errormsg'>Please Enter CTC</p>}
                        </div>

                        <div className='inneronerow'>
                            <label className='form-label'> UAN </label>
                            <input type="text" onChange={inputHandle} value={UAN} name="UAN" className="form-control w-75" id="UAN" placeholder='Enter PF Number' />
                        </div>
                    </div>
                </div>
                <div className='Formbtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Next</button>
                    <button className='btn fw-bold' onClick={handleCancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>Cancel</button>
                </div>
            </form>
        </div>

    )
}

export default EmployeesDetails
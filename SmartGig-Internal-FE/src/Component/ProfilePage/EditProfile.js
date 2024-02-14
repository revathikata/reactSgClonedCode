import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../API/api"
import moment from 'moment';
import { toast } from 'react-toastify';

const initialData = {
    employeeDetailsId: "",
    fullName: "",
    empId: "",
    gender: "",
    dateOfJoining: "",
    primaryLocation: "",
    currentLocation: "",
    qualification: "",
    primarySkills: "",
    secondrySkills: "",
    dateOfBirth: "",
    dateOfMarriage: "",
    experience: 0,
    fixedctc: 0,
    variablepay: 0,
    ctc: 0,
    degination: "",
    role: "",
    empType: "",
    status: true,
    lastWorkingDay: "",
    email: "",
    mobileNo: 0,
    alternateMobile: "",
    UAN: "",
    hiredAs: ""
}


export default function EditProfile() {
    const [data, setData] = useState(initialData);
    const [ctc, setCtc] = useState(initialData.ctc);
    const [roleofemp, setRoleofemp] = useState([])
    const navigate = useNavigate();

    const inputHandleVarPay = (e) => {
        setData({
            ...data,
            [e.target.name]: [e.target.value],
        })
        handleCTC();
        console.log("HHH");
    }

    const inputHandleCtc = (e) => {
        setCtc(e.target.value)
        console.log("ctc");
    }

    const handleCTC = () => {
        console.log("HHH");
        let fctc = document.getElementById("fixedctc").value;
        let varpy = document.getElementById("varpay").value;
        var newctc = parseInt(fctc) + parseInt(varpy);
        setCtc(newctc);
    }

    const {
        employeeDetailsId,
        fullName,
        empId,
        gender,
        dateOfJoining,
        primaryLocation,
        currentLocation,
        qualification,
        primarySkills,
        secondrySkills,
        dateOfBirth,
        dateOfMarriage,
        // ctc,
        experience,
        variablepay,
        fixedctc,
        degination,
        role,
        empType,
        lastWorkingDay,
        email,
        mobileNo,
        alternateMobile,
        UAN,
        hiredAs
    } = data


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

    useEffect(() => {
        setData(
            {
                employeeDetailsId: window.localStorage.getItem("EDIT_ID"),
                ctc: window.localStorage.getItem("CTC"),
                currentLocation: window.localStorage.getItem("CRNTLOCATION"),
                degination: window.localStorage.getItem("DEGINATION"),
                role: window.localStorage.getItem("ROLE"),
                dateOfBirth: moment(window.localStorage.getItem("DOB")).format('YYYY-MM-DD'),
                dateOfJoining: moment(window.localStorage.getItem("DOJ")).format('YYYY-MM-DD'),
                dateOfMarriage: (window.localStorage.getItem("DOM") == "null") ? "" : (moment(window.localStorage.getItem("DOM")).format('YYYY-MM-DD')),
                lastWorkingDay: (window.localStorage.getItem("LWD") == "null") ? "" : (moment(window.localStorage.getItem("LWD")).format('YYYY-MM-DD')),
                email: window.localStorage.getItem("EMAIL"),
                empId: window.localStorage.getItem("EMP_ID"),
                empType: window.localStorage.getItem("EMP_TYPE"),
                fullName: localStorage.getItem("FULLNAME"),
                gender: window.localStorage.getItem("GENDER"),
                mobileNo: window.localStorage.getItem("MOB_NO"),
                primaryLocation: window.localStorage.getItem("P_LOC"),
                primarySkills: window.localStorage.getItem("P_SKILLS"),
                qualification: window.localStorage.getItem("QUALIFICATION"),
                secondrySkills: window.localStorage.getItem("S_SKILLS"),
                fixedctc: window.localStorage.getItem("FIXED_CTC"),
                variablepay: window.localStorage.getItem("VARIABLE_PAY"),
                experience: window.localStorage.getItem("EXPERIENCE"),
                hiredAs: window.localStorage.getItem("HIREDAS"),
                UAN: (window.localStorage.getItem("UAN") == "") ? "" : (window.localStorage.getItem("UAN")),
                alternateMobile: (window.localStorage.getItem("ALT_MOB") == "") ? "" : (window.localStorage.getItem("ALT_MOB")),
            }
        )
    }, [])

    const inputHandle = (e) => {
        setData({
            ...data,
            [e.target.name]: [e.target.value]
        })
    }


    const handleSubmitEditForm = (e) => {
        e.preventDefault();
        axios.put(`${global.API_URL}/smg/employee/editEmployeeDetails/${window.localStorage.getItem("EDIT_ID")}`, {
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
            // status: true,
            lastWorkingDay: `${lastWorkingDay}`,
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
                // console.log("data updated", res.data);
                toast.success("Data updated successfully");
                navigate('/profilepage/employeelist')

            }).catch((error) => {
                console.log("Error found", error)
            })
    }

    const handleCancel = () => {
        navigate("/profilepage/employeelist")
    }


    return (
        <div>
            <form onSubmit={handleSubmitEditForm}>
                <div className='mainWrapper'>
                    <div className='innerone'>
                        <div>
                            <label className='form-label'>Employee Id </label>
                            <input type="text" disabled value={empId} name="empId" className="form-control w-75" id="pwd" placeholder='Enter Your Employee Id' />
                        </div>
                        <div>
                            <label className='form-label'> Full Name </label>
                            <input type="text" onChange={inputHandle} value={fullName} name="fullName" className="form-control w-75" id="pwd" placeholder='Enter Your Full Name' />

                        </div>

                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Gender </label>
                                <select className='gnder form-select w-75' onChange={inputHandle} value={gender} name="gender" >
                                    <option>
                                        Select
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
                                <label className='form-label'>DOB </label>
                                <input type="date" onChange={inputHandle} value={dateOfBirth} name="dateOfBirth" className="form-control w-75" id="pwd" />
                            </div>
                        </div>
                        <div>
                            <label className='form-label'> Email Id </label>
                            <input disabled type="email" onChange={inputHandle} value={email} name="email" className="form-control w-75" id="pwd" placeholder='Enter Email  Id' />

                        </div>
                        <div>
                            <label className='form-label'>Mobile No </label>
                            <input disabled type="number" onChange={inputHandle} value={mobileNo} name="mobileNo" className="form-control w-75" placeholder='Enter Your Number' />
                        </div>
                        <div>
                            <label className='form-label'> Alternate Mobile No </label>
                            <input type="text" onChange={inputHandle} value={alternateMobile} name="alternateMobile" className="form-control w-75" placeholder='Enter Your Alternate Number' />
                        </div>
                        <div>
                            <label className='form-label'> Hired For <sup className='star'>*</sup></label>
                            <select className='detailsType form-select w-75' onChange={inputHandle} value={hiredAs} name="hiredAs">
                                <option></option>
                                <option>Internal</option>
                                <option>External</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className='innerone'>

                        <div>
                            <label className='form-label'>Employee Type </label>
                            <select className='detailsType form-select w-75' onChange={inputHandle} value={empType} name="empType">
                                <option>Select Employee Type</option>
                                <option>Intern</option>
                                <option>Full Time</option>
                                <option>Part Time</option>
                            </select>
                        </div>
                        <div>
                            <label className='form-label'>Designation </label>
                            <select onChange={inputHandle} value={degination} name="degination" className="form-select w-75">
                                <option>Select</option>
                                <option>CEO</option>
                                <option>Associate HR Manager</option>
                                <option>Associate Manager</option>
                                <option>HR Executive</option>
                                <option>Senior HR Executive	</option>
                                <option>HR Lead Analyst	</option>
                                <option>HR Manager	</option>
                                <option>Senior HR Manager	</option>
                                <option>Manager</option>
                                <option>Software Consultant	</option>
                                <option>Senior Manager	</option>
                                <option>Senior Software Consultant</option>
                                <option>Software Lead Consultant</option>
                            </select>
                        </div>
                        <div>
                            <label className='form-label'>Role</label>
                            <select onChange={inputHandle} value={role} name="role" className="form-select w-75">

                                {
                                    roleofemp.map((list, index) => {
                                        return <option key={index}>{list}</option>
                                    })
                                }
                            </select >
                        </div>
                        <div>
                            <label className='form-label'>Qualification </label>
                            <select type="text" onChange={inputHandle} value={qualification} name="qualification" className="form-select w-75">
                                <option>Select</option>
                                <option>UG</option>
                                <option>PG</option>
                            </select>
                        </div>
                        <div>
                            <label className='form-label'>Primary Skills</label>
                            <select onChange={inputHandle} value={primarySkills} name="primarySkills" className="form-select w-75">
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
                        </div>
                        <div>
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
                        </div>
                        <div className='inneronerow'>
                            <label className='form-label'> UAN </label>
                            <input type="text" onChange={inputHandle} value={UAN} name="UAN" className="form-control w-75" id="UAN" placeholder='Enter Your PF Number' />
                        </div>
                    </div>
                    <div className='innerone'>

                        <div>
                            <label className='form-label'>Work Location </label>
                            <select onChange={inputHandle} value={primaryLocation} name="primaryLocation" className="form-select w-75">
                                <option>Select</option>
                                <option>Bangalore</option>
                                <option>Hyderabad</option>
                                <option>Tirupati</option>
                            </select>
                        </div>
                        <div>
                            <label className='form-label'>Current Location</label>
                            <input type="text" onChange={inputHandle} value={currentLocation} name="currentLocation" className="form-control w-75" id="pwd" placeholder='Enter Your Current Location' />
                        </div>
                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>DOJ</label>
                                <input type="date" className="form-control w-75" id="pwd" name="dateOfJoining" onChange={inputHandle} value={dateOfJoining} />
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>DOM</label>
                                <input type="date" onChange={inputHandle} value={dateOfMarriage} name="dateOfMarriage" className="form-control w-75" id="pwd" />

                            </div>
                        </div>
                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Last Working Day </label>
                                <input type="date" onChange={inputHandle} value={lastWorkingDay} name="lastWorkingDay" className="form-control w-75" id="pwd" placeholder='Enter Your Employee Id' />
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>Experience <sup className='star'>*</sup></label>
                                <input type="text" onChange={inputHandle} value={experience} name="experience" className="form-control w-75" id="pwd" placeholder='Enter Your experience' />
                            </div>
                        </div>
                        <div className='DateRow'>
                            <div className='inneronerow'>
                                <label className='form-label'>Fixed CTC <sup className='star'>*</sup></label>
                                <input type="text" onChange={inputHandleVarPay} value={fixedctc} id='fixedctc' name="fixedctc" className="form-control w-75" placeholder='Enter Your fixed ctc' />
                            </div>
                            <div className='inneronerow'>
                                <label className='form-label'>Variable pay <sup className='star'>*</sup></label>
                                <input type="text" onChange={inputHandleVarPay} value={variablepay} id='varpay' name="variablepay" className="form-control w-75" placeholder='Enter Your variable pay' />
                            </div>
                        </div>
                        <div className='inneronerow'>
                            <label className='form-label'>CTC <sup className='star'>*</sup></label>
                            <input type="text" onChange={inputHandleCtc} value={ctc} name="ctc" className="form-control w-75" id="pwd" placeholder='Enter Your ctc' />
                        </div>
                    </div>
                </div>
                <div className='Formbtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Next</button>
                    <button className='btn fw-bold' onClick={handleCancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>cancel</button>
                </div>
            </form>
        </div>
    )
}

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Profile.css';
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';
import { Tooltip } from '@mui/material';


const initialData = {
    // fullName: '',
    // clientName: "",
    // projectName: "",
    noOfLeaves: 0,
    dayRate: "",
    fromDate: "",
    toDate: "",
}
const searchData = {
    fullName1: '',
    clientName1: "",
    projectName1: ""
}


const Billing = () => {

    const navigate = useNavigate();

    const [DaysDifference, setDaysDifference] = useState();
    const [TotalDays, setTotalDays] = useState();
    const [TotalAmount, setTotalAmount] = useState();
    const [visible, setVisible] = useState(false)

    const [techemployee, setTechemployee] = useState([]);
    const [assigndata, setAssigndata] = useState([]);

    const [datalist, setDatalist] = useState([]);
    const [startDateBkend, setStartDateBkend] = useState();
    const [endDateBkend, setEndDateBkend] = useState();
    const [err, setErr] = useState("");

    const [project, setProject] = useState([]);
    const [optionList, setOptionList] = React.useState([]);

    const [{ fullName, clientName, projectName }, setUpdate] = useState({
        fullName: "",
        clientName: "",
        projectName: ""
    });

    const [search1, setSearch1] = useState(searchData);

    const [assignproject, setAssignproject] = useState(initialData)

    const {
        // fullName,
        // clientName,
        // projectName,
        noOfLeaves,
        dayRate,
        fromDate,
        toDate,
    } = assignproject

    const {
        fullName1,
        clientName1,
        projectName1
    } = search1

    const heading = ['Employee Name', 'Project Name', 'Client Name', 'Start-Date', "End-Date", "Day", "No of Leaves", "Total Days", "Day/Rate", "Total Amount"];

    const inputHandle = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })
    }

    const handleSearchInput = (e) => {
        setSearch1({
            ...search1,
            [e.target.name]: [e.target.value]
        })
    }

    const inputHandleDays = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })

        if ((Math.abs(new Date(document.getElementById("firstdate").value))) < (Math.abs(new Date(startDateBkend)))) {
            window.confirm(`From Date should be after (${moment(startDateBkend).format("Do MMM, YYYY")})`)
            { (setAssignproject(initialData)) }
        }

        if ((Math.abs(new Date(new Date(document.getElementById("firstdate").value)))) > (Math.abs(new Date(endDateBkend)))) {
            window.confirm(` From Date should be less than (${moment(endDateBkend).format("Do MMM, YYYY")})`)
            { (setAssignproject(initialData)) }
        }

        datediffFn();
    }

    const inputHandleDays1 = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })

        if ((Math.abs(new Date(document.getElementById("seconddate").value))) > (Math.abs((moment(Math.abs(new Date(endDateBkend))).add(1, "days"))._d))) {
            window.confirm(`To Date should be Before (${moment(endDateBkend).format("Do MMM, YYYY")})`)
            { (setAssignproject(initialData)) }
        }

        if ((Math.abs(new Date(new Date(document.getElementById("seconddate").value)))) < (Math.abs(new Date(startDateBkend)))) {
            window.confirm(` To Date should be greater than (${moment(startDateBkend).format("Do MMM, YYYY")})`)
            { (setAssignproject(initialData)) }
        }

        if (((new Date(document.getElementById("firstdate").value)).getMonth()) != ((new Date(document.getElementById("seconddate").value)).getMonth())) {
            window.confirm("Month should be same")
            { (setAssignproject(initialData)) }
        }
        datediffFn();
    }

    const inputHandleTotaldays = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })
        TotaldaysFn();
    }

    const inputHandleTotalAmount = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })
        TotalAmountFn();
    }

    function handleEmployeeChange(e) {
        setUpdate(data => ({ fullName: e.target.value, projectName: '', clientName: "" }));
    }

    function handleProjectChange(event) {
        setUpdate(data => ({ ...data, projectName: event.target.value }));
    }

    function handleClientChange(event) {
        setUpdate(data => ({ ...data, projectName: '', clientName: event.target.value }));
    }

    const handleSubmitBilling = (e) => {
        e.preventDefault();
        axios.post(`${global.API_URL}/smg/billing/saveEmployeeBill`, {
            fullName: `${fullName}`,
            clientName: `${clientName}`,
            projectName: `${projectName}`,
            day: `${DaysDifference}`,
            noOfLeaves: `${noOfLeaves}`,
            totalDays: `${TotalDays}`,
            dayRate: `${dayRate}`,
            fromDate: `${fromDate}`,
            toDate: `${toDate}`,
            totalAmount: `${TotalAmount}`
        },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            }).then((res) => {
                // console.log("response", res);
                if (res.data.msg == "Bill added") {
                    toast.success("Bill Added Successfully")
                    setAssigndata(oldData => [...oldData, res.data])
                    GetAssignData();
                    setAssignproject(initialData);
                    setTotalAmount("");
                    setTotalDays("");
                    setDaysDifference("");
                    setUpdate({ fullName: "", clientName: "", projectName: "" })
                }
            }).catch((err) => {
                console.log("error", err);
            })
    }

    const GetAssignData = () => {
        axios.get(`${global.API_URL}/smg/billing/getAllEmployeeBills`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            // console.log("Fetch successfully", res.data);
            setAssigndata(res.data);
        }).catch((err) => {
            console.log("some error", err);
        })
    }


    useEffect(() => {

        const GetEmpDetails = () => {
            axios.get(`${global.API_URL}/smg/employee/getTechEmp`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            }).then((res) => {
                setTechemployee(res.data)
            }).catch((err) => {
                console.log("some error", err);
            })
        }


        GetEmpDetails();
        GetAssignData();

    }, []);

    const GetClientProjectDetails = () => {
        axios.get(`${global.API_URL}/smg/billing/getEmpProject/${fullName}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            setDatalist(res.data)
        }).catch((err) => {
            console.log("some error", err);
        })
    }

    useEffect(() => {
        if (fullName) {
            GetClientProjectDetails();
        }
    }, [fullName])

    const handleDateCompare = () => {
        // console.log("fname", fullName);
        axios.get(`${global.API_URL}/smg/billing/getProjectAssignedDate?clientName=${clientName}&fullname=${fullName}&projectName=${projectName}`,
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            })
            .then((res) => {
                setStartDateBkend(res.data.startdate)
                setEndDateBkend(res.data.endDate)
            })
            .catch((err) => {
                console.log("Err", err);
            })
    }
    useEffect(() => {

        if (projectName) {
            handleDateCompare();
        }
    }, [projectName])

    const handleEditButton = (billId) => {
        window.localStorage.setItem("BILL_ID", billId)
        axios.get(`${global.API_URL}/smg/billing/getEmployeeBill/${billId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            let {
                DayRate,
                Days,
                EmployeeName,
                FromDate,
                NoOfLeaves,
                ToDate,
                TotalAmount,
                TotalDays,
                clientName,
                projectName
            } = res.data;

            window.localStorage.setItem("DAY_RATE", DayRate);
            window.localStorage.setItem("DAYS", Days);
            window.localStorage.setItem("EMPLOYEE_NAME", EmployeeName);
            window.localStorage.setItem("NO_OF_LEAVES", NoOfLeaves);
            window.localStorage.setItem("FROM_DATE", FromDate);
            window.localStorage.setItem("TO_DATE", ToDate);
            window.localStorage.setItem("TOTAL_AMOUNT", TotalAmount);
            window.localStorage.setItem("TOTAL_DAYS", TotalDays);
            window.localStorage.setItem("CLIENT_NAME", clientName);
            window.localStorage.setItem("PROJECT_NAME", projectName);

            navigate("/profilepage/billingedit")

        }).catch((err) => {
            console.log("error", err);
        })
    }

    useEffect(() => {
        const GetProjectDetails = () => {
            axios.get(`${global.API_URL}/smg/project/getAllProjectDetails`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            }).then((res) => {
                const data = res.data
                let result = data.filter(items => items.projectStatus !== "Completed")
                setProject(result);
            }).catch((err) => {
                console.log("some error", err);
            })
        }
        const GetClientDetails = () => {
            axios.get(`${global.API_URL}/smg/client/getAllClientDetails`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            }).then((res) => {
                setOptionList(res.data)
            }).catch((err) => {
                console.log("some error", err);
            })
        }
        GetProjectDetails();
        GetClientDetails();
    }, [])

    const handleSearch = (e) => {
        e.preventDefault();
        axios.post(`${global.API_URL}/smg/billing/getEmployeeBillingFilter`, {
            fullName: `${fullName1}`,
            clientName: `${clientName1}`,
            projectName: `${projectName1}`
        }, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                setAssigndata(res.data)
            })
            .catch((err) => {
                console.log("err", err);
            })
    }


    const datediffFn = () => {

        const d1 = document.getElementById("firstdate").value;
        const d2 = document.getElementById("seconddate").value;
        const Date1 = new Date(d1);
        const Date2 = new Date(d2);

        // if ((Math.abs(new Date(document.getElementById("firstdate").value))) << (Math.abs(new Date(startDateBkend)))) {
        //     setErr("enter valid date")
        // }
        // else {
        //     setErr("")
        // }
        // if ((Math.abs(Date1)) >> (Math.abs(new Date(startDateBkend)))) {
        //     setErr("")
        // }
        const time = Math.abs(Date2 - Date1);
        const DaysDiff = Math.ceil(time / (1000 * 60 * 60 * 24))

        document.getElementById("DAYS").innerHTML = DaysDiff
        setDaysDifference(DaysDiff);
        setTotalDays(DaysDiff);
    }

    const TotaldaysFn = () => {
        const d1 = document.getElementById("DAYS").value;
        const d2 = document.getElementById("TotalLeaves").value;
        const totalDays = d1 - d2;
        setTotalDays(totalDays);
    }

    const TotalAmountFn = () => {

        const totalDays = document.getElementById("TotalDays").value;
        const PerDayRate = document.getElementById("PerDayRate").value;

        const TotalAmt = totalDays * PerDayRate;
        setTotalAmount(TotalAmt)

    }

    const openFilter = () => {
        setVisible(!visible);
    }

    const hanldeClear = () => {
        setSearch1(searchData)
        GetAssignData();
        setVisible(false)
    }

    return (
        <>
            {visible ? "" : <button className='btn  bi bi-search me-3 searchButton' onClick={openFilter}></button>}

            {visible ?
                (
                    <div className='d-flex justify-content-around mb-2 mt-2'>
                        <input className='form-control w-25' value={fullName1} name="fullName1" placeholder='Enter Employee Name' onChange={handleSearchInput} />
                        <select className='form-select w-25' onChange={handleSearchInput} value={clientName1} placeholder='Enter Employee Name' name='clientName1' >
                            <option >Select Client</option>
                            {
                                optionList.map((list, index) => {
                                    return <option key={index} >{list.clientName}</option>
                                })
                            }
                        </select>
                        <select className='form-select w-25' value={projectName1} name='projectName1' onChange={handleSearchInput}  >
                            <option >Select Project</option>
                            {
                                project.map((items, index) => {
                                    return <option key={index}>{items.projectName}</option>
                                })
                            }
                        </select>
                        <button type='submit' className='btn btn-outline-info bi bi-search' onClick={handleSearch} > Search</button>
                        <button type='button' className='btn btn-outline-warning' onClick={hanldeClear}> Clear</button>
                    </div>) : (
                    <div>
                        <form onSubmit={handleSubmitBilling}>
                            <h5>Billing</h5>
                            <hr />
                            <div className='mainWrapper'>
                                <div className='innerone'>
                                    <div>
                                        <label className='form-label'> Employee Name <sup>*</sup></label>
                                        <select name="fullName" value={fullName} onChange={handleEmployeeChange} className='form-select w-75'>
                                            <option>Select</option>
                                            {
                                                techemployee.map((element) => {
                                                    return <option key={element.empId} >{element.fullName}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='DateRow'>
                                        <div className='inneronerow'>
                                            <label className='form-label'>From Date <sup>*</sup></label>
                                            <input id="firstdate" name="fromDate" value={fromDate} onChange={inputHandleDays} type="date" className="form-control w-75" />
                                            <p style={{ color: "red" }}>{err}</p>
                                        </div>
                                        <div className='inneronerow'>
                                            <label className='form-label'>To Date <sup>*</sup></label>
                                            <input id="seconddate" name="toDate" value={toDate} onChange={inputHandleDays1} type="date" className="form-control w-75" />

                                        </div>
                                    </div>
                                    <div>
                                        <label className='form-label'>Total Days<sup>*</sup></label>
                                        <input type='text' id="TotalDays" value={TotalDays} name='TotalDays' disabled className='form-control w-75' />
                                    </div>
                                </div>
                                <div className='innerone'>
                                    <div>
                                        <label className='form-label'> Client Name <sup>*</sup></label>
                                        <select className='form-select w-75' value={clientName} name="clientName" onChange={handleClientChange}>
                                            <option>select</option>
                                            {
                                                datalist.map((data) => {
                                                    return <option key={data.client}>{data.client}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <label className='form-label' >Day<sup>*</sup></label>
                                        <input disabled value={DaysDifference} name="DaysDifference" type='text' id="DAYS" className='form-control w-75' />

                                    </div>
                                    <div>
                                        <label className='form-label'>Day/Rate<sup>*</sup></label>
                                        <input type='text' id="PerDayRate" value={dayRate} name="dayRate" onChange={inputHandleTotalAmount} className='form-control w-75' />
                                    </div>
                                </div>
                                <div className='innerone'>
                                    <label className='form-label'> Project Name <sup>*</sup></label>
                                    <select className='form-select w-75' value={projectName} name="projectName" onChange={handleProjectChange}>
                                        <option>select</option>
                                        {
                                            datalist.find(item => item.client === clientName)?.project.map((projectName) => (
                                                (
                                                    <option key={projectName} value={projectName}>
                                                        {projectName}
                                                    </option>
                                                )))
                                        }

                                    </select>
                                    <div>
                                        <label className='form-label'>Total no. of Leaves<sup>*</sup></label>
                                        <input type='text' id="TotalLeaves" value={noOfLeaves} name="noOfLeaves" onChange={inputHandleTotaldays} className='form-control w-75' />
                                    </div>
                                    <div>
                                        <label className='form-label'>Total Amount<sup>*</sup></label>
                                        <input type='text' disabled value={TotalAmount} name="TotalAmount" className='form-control w-75' />
                                    </div>
                                </div>
                            </div>

                            <div className='btngroupBilling'>
                                <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }}>Submit</button>
                                {/* <button className='btn fw-bold' onClick={handlecancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>cancel</button> */}
                            </div>
                        </form>
                    </div>)}
            <hr />



            <div className='Border'>
                <table className="table table-sm table-hover mb-0 tablecontent">
                    <thead>
                        <tr>
                            {
                                heading.map((data, index) => (

                                    <th key={index} style={{ fontWeight: '600', color: '#252F40' }}>{data}</th>

                                ))
                            }
                        </tr>

                    </thead>
                    <tbody >
                        {
                            assigndata.map((data, index) => {
                                return <tr key={index}  >
                                    <td >{data.EmployeeName}</td>
                                    <td >{data.projectName}</td>
                                    <td >{data.clientName}</td>
                                    <td >{moment(data.FromDate).format('MMM Do, YYYY')}</td>
                                    <td >{moment(data.ToDate).format('MMM Do, YYYY')}</td>
                                    <td >{data.Days}</td>
                                    <td >{data.NoOfLeaves}</td>
                                    <td >{data.TotalDays}</td>
                                    <td >{data.DayRate}</td>
                                    <td >{data.TotalAmount}</td>
                                    <Tooltip title='Edit'>
                                        <td className='bi bi-pen-fill' style={{ cursor: 'pointer' }} onClick={() => handleEditButton(data.billId)}></td>
                                    </Tooltip>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Billing;

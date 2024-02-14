import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import './Profile.css';
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';
import { Tooltip } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Pagination from './Pagination/Pagination';
import * as XLSX from 'xlsx';

const initialData = {
    TypeOfRate: "",
    fromDate: "",
    toDate: "",
}
const searchData = {
    fullName1: '',
    clientName1: "",
    projectName1: ""
}

let PageSize = 15

const Billing = () => {

    const navigate = useNavigate();

    const [DaysDifference, setDaysDifference] = useState();
    const [TotalDays, setTotalDays] = useState();
    const [TotalAmount, setTotalAmount] = useState();
    const [visible, setVisible] = useState(false)
    const [sortOrder, setSortOrder] = useState('asc');
    const [techemployee, setTechemployee] = useState([]);
    const [assigndata, setAssigndata] = useState([]);

    const [datalist, setDatalist] = useState([]);
    const [startDateBkend, setStartDateBkend] = useState();
    const [endDateBkend, setEndDateBkend] = useState();
    const [err, setErr] = useState("");

    const [project, setProject] = useState([]);
    const [optionList, setOptionList] = React.useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const currentTableData = useMemo(() => {

        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return assigndata.slice(firstPageIndex, lastPageIndex);

    }, [currentPage, assigndata]);


    const sorting = () => {
        let sortedData = [...assigndata];
        if (sortOrder === "asc") {
            sortedData.sort((a, b) => a.Rate - b.Rate);
            setSortOrder("desc");
        } else {
            sortedData.sort((a, b) => b.Rate - a.Rate);
            setSortOrder("asc");
        }
        setAssigndata(sortedData);
    };


    const [{ fullName, clientName, projectName }, setUpdate] = useState({
        fullName: "",
        clientName: "",
        projectName: ""
    });

    const [search1, setSearch1] = useState(searchData);

    const [assignproject, setAssignproject] = useState(initialData)

    const [Days, setDays] = useState(0);
    const [monthdayhour, setMonthdayhour] = useState("");
    const [dayRate, setDayRate] = useState(0);

    const [searchNo, setSearchNo] = useState('')
    const [billingData, setBillingData] = useState([]);
    const [filterdata, setFilterData] = useState([])
    const [projectState, setProjectState] = useState('');
    const [clientState, setClientState] = useState('');
    const [statusState, setStatusState] = useState('');

    const {
        // fullName,
        // clientName,
        // projectName,
        // Days,
        // dayRate,
        TypeOfRate,
        fromDate,
        toDate,
    } = assignproject

    const {
        fullName1,
        clientName1,
        projectName1
    } = search1

    const heading = ['Employee Name', 'Project Name', 'Client Name', 'Start-Date', "End-Date", "Type"];

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

    const inputHandleTypeOfRate = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })

        if ((document.getElementById("TypeOfRate").value) == "Monthly") {
            setDays(22);
            setDayRate("");
            setMonthdayhour("Month");
        }
        else if ((document.getElementById("TypeOfRate").value) == "Daily") {
            setDays("");
            setDayRate("");
            setMonthdayhour("Day");
        }
        else if ((document.getElementById("TypeOfRate").value) == "Hourly") {
            setDays("");
            setDayRate("");
            setMonthdayhour("Hour");
        }
    }

    // const HandleDays = (e) => {
    //     setDays(e.target.value)
    //     if ((document.getElementById("TypeOfRate").value) == "Monthly") {
    //         TotalAmountFnForMonth();
    //     }
    //     else if ((document.getElementById("TypeOfRate").value) == "Daily") {
    //         TotalAmountFnForDays();
    //     }
    //     else if ((document.getElementById("TypeOfRate").value) == "Hourly") {
    //         TotalAmountFnForHour();
    //     }
    // }

    const HandleRate = (e) => {
        setDayRate(e.target.value)
        if ((document.getElementById("TypeOfRate").value) == "Monthly") {
            TotalAmountFnForMonth();
        }
        else if ((document.getElementById("TypeOfRate").value) == "Daily") {
            TotalAmountFnForDays();
        }
        else if ((document.getElementById("TypeOfRate").value) == "Hourly") {
            TotalAmountFnForHour();
        }
    }

    const inputHandleDays = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })
        // datediffFn();
    }

    const inputHandleDays1 = (e) => {
        setAssignproject({
            ...assignproject,
            [e.target.name]: [e.target.value]
        })
        // datediffFn();
    }


    // const inputHandleTotalAmount = (e) => {
    //     setAssignproject({
    //         ...assignproject,
    //         [e.target.name]: [e.target.value]
    //     })
    //     TotalAmountFn();
    // }

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
        axios.post(`${global.API_URL}/smg/billing/saveBillingRate`, {
            fullName: `${fullName}`,
            clientName: `${clientName}`,
            projectName: `${projectName}`,
            fromDate: `${fromDate}`,
            toDate: `${toDate}`,
            rateType: `${TypeOfRate}`,
            rate: `${dayRate}`,
        },
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            }).then((res) => {
                console.log("response", res);
                if (res.data.msg == "Billing rate added") {
                    toast.success("Bill Added Successfully")
                    setAssigndata(oldData => [...oldData, res.data])
                    GetAssignData();
                    setAssignproject(initialData);
                    setDayRate("")
                    setUpdate({ fullName: "", clientName: "", projectName: "" })
                }
            }).catch((err) => {
                console.log("error", err);
            })
    }

    const GetAssignData = () => {
        axios.get(`${global.API_URL}/smg/billing/getAllBillingRate`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            console.log("Fetch successfully", res.data);
            setAssigndata(res.data);
            setBillingData(res.data);
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

    const handleEditButton = (BillingRateId) => {
        window.localStorage.setItem("BILL_ID", BillingRateId)
        axios.get(`${global.API_URL}/smg/billing/getBillingRateById/${BillingRateId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            let {
                EmployeeName,
                clientName,
                projectName,
                FromDate,
                ToDate,
                RateType,
                Rate,
            } = res.data;

            window.localStorage.setItem("DAY_RATE", Rate);
            window.localStorage.setItem("EMPLOYEE_NAME", EmployeeName);
            window.localStorage.setItem("TYPE_OF_RATE", RateType);
            window.localStorage.setItem("FROM_DATE", FromDate);
            window.localStorage.setItem("TO_DATE", ToDate);
            window.localStorage.setItem("CLIENT_NAME", clientName);
            window.localStorage.setItem("PROJECT_NAME", projectName);

            navigate("/profilepage/billingedit")

        }).catch((err) => {
            console.log("error", err);
        })
    }

    const onDeleteBilling = (BillingRateId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            axios.delete(`${global.API_URL}/smg/billing/deleteRateById/${BillingRateId}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            })
                .then(() => {
                    GetAssignData();
                })
                .catch((err) => {
                })
        }
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

    const TotalAmountFnForMonth = () => {
        const PerDayRate = document.getElementById("PerDayRate").value;
        const TotalAmt = 1 * PerDayRate;
        setTotalAmount(TotalAmt)

    }

    const TotalAmountFnForDays = () => {
        const totalDays = document.getElementById("TotalDays").value;
        const PerDayRate = document.getElementById("PerDayRate").value;
        const TotalAmt = totalDays * PerDayRate;
        setTotalAmount(TotalAmt)

    }

    const TotalAmountFnForHour = () => {
        const totalDays = document.getElementById("TotalDays").value;
        const PerDayRate = document.getElementById("PerDayRate").value;
        const TotalAmt = totalDays * PerDayRate * 8;
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

    const searchStatus = (e) => {
        const getStatus = e.target.value;
        if (getStatus.length > 0) {
            const searchData = billingData.filter((data) =>
                data.EmployeeName.toLowerCase().includes(getStatus)
            )
            setAssigndata(searchData);
        } else {
            setAssigndata(billingData);
        }

        setStatusState(getStatus);
    };


    const searchProject = (e) => {
        const getproject = e.target.value;
        if (getproject.length > 0) {
            const searchData = billingData.filter((data) =>
                data.projectName.toLowerCase().includes(getproject)
            )
            setAssigndata(searchData);
        } else {
            setAssigndata(billingData);
        }

        setProjectState(getproject);
    };

    const searchClient = (e) => {
        const getclient = e.target.value;
        if (getclient.length > 0) {
            const searchData = billingData.filter((data) =>
                data.clientName.toLowerCase().includes(getclient)
            )
            setAssigndata(searchData);
        } else {
            setAssigndata(billingData);
        }

        setClientState(getclient);
    };

    const exportSheet = () => {
        const filteredData = assigndata.map(item => {
            const { lapPassword, ...rest } = item;
            return rest;
        });
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(wb, ws, "BillingData");
        XLSX.writeFile(wb, "BillingData.xlsx");
    }

    return (
        <>
            {/* {visible ? "" : <button className='btn  bi bi-search me-3 searchButton' onClick={openFilter}></button>} */}

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
                                            <label className='form-label'>To Date </label>
                                            <input id="seconddate" name="toDate" value={toDate} onChange={inputHandleDays1} type="date" className="form-control w-75" />

                                        </div>
                                    </div>
                                    {/* <div>
                                        <label className='form-label'>Total Days<sup>*</sup></label>
                                        <input type='text' id="TotalDays" value={TotalDays} name='TotalDays' disabled className='form-control w-75' />
                                    </div> */}
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
                                    {/* <div>
                                        <label className='form-label' >Day<sup>*</sup></label>
                                        <input disabled value={DaysDifference} name="DaysDifference" type='text' id="DAYS" className='form-control w-75' />

                                    </div> */}
                                    <div className='inneronerow'>
                                        <label className='form-label'>Type of Rate</label>
                                        <select className='form-select w-75' value={TypeOfRate} name="TypeOfRate" id='TypeOfRate' onChange={inputHandleTypeOfRate}>
                                            <option>
                                                select
                                            </option>
                                            <option>
                                                Monthly
                                            </option>
                                            <option>
                                                Daily
                                            </option>
                                            <option>
                                                Hourly
                                            </option>
                                        </select>
                                    </div>


                                    {/*  <div className='inneronerow'>
                                            <label className='form-label'>Hourly</label>
                                            <input type='text' id="PerDayRate" value={dayRate} name="dayRate" onChange={inputHandleTotalAmount} className='form-control w-75' />
                                        </div> */}

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
                                    <div className='inneronerow'>
                                        <label className='form-label'>Rate/{monthdayhour}</label>
                                        <input type='text' id="PerDayRate" value={dayRate} name="dayRate" onChange={HandleRate} className='form-control w-75' />
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

            <div className='d-flex justify-content-between'>
                <h5>Billing Details</h5>
                <input
                    className="form-control w-25"
                    placeholder="Search By Client Name"
                    name="clientState"
                    value={clientState}
                    onChange={searchClient}
                />
                <input
                    className="form-control w-25"
                    placeholder="Search By Project Name"
                    name="typprojectStatee"
                    value={projectState}
                    onChange={searchProject}
                />
                <input
                    className="form-control w-25"
                    placeholder="Search By Employee Name"
                    name="statusState"
                    value={statusState}
                    onChange={searchStatus}
                />

                <button className="btn btn-outline-dark btn-sm" onClick={exportSheet}>
                    Export Sheet
                </button>
            </div>
            <hr />
            <div className='Border'>
                <table className="table table-sm table-hover mb-0 tablecontent">
                    <thead>
                        <tr className='laptopheadings'>
                            {
                                heading.map((data, index) => (

                                    <th key={index} >{data}</th>

                                ))
                            }
                            <th onClick={() => sorting('Rate')}><span className='me-2'>Rate</span> <span className="bi bi-arrow-down-up"></span>
                            </th>
                        </tr>

                    </thead>
                    <tbody >
                        {
                            currentTableData.map((data, index) => {
                                return <tr key={index}  >
                                    <td >{data.EmployeeName}</td>
                                    <td >{data.projectName}</td>
                                    <td >{data.clientName}</td>
                                    <td >{moment(data.FromDate).format('MMM Do, YYYY')}</td>
                                    <td >{moment(data.ToDate).format('MMM Do, YYYY')}</td>
                                    <td >{data.RateType}</td>
                                    <td >{data.Rate}</td>
                                    <Tooltip title='Edit'>
                                        <td className='bi bi-pen-fill' style={{ cursor: 'pointer' }} onClick={() => handleEditButton(data.BillingRateId)}></td>
                                    </Tooltip>
                                    <Tooltip title='Delete'>
                                        <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteBilling(data.BillingRateId)}></td>
                                    </Tooltip>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={assigndata.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    data={assigndata}
                />
            </div>
        </>
    );
}

export default Billing;

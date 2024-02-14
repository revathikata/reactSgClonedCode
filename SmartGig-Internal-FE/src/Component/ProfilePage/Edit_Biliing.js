import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const initialDate = {
    fromDate: "",
    toDate: ""
}

export default function Edit_Biliing() {
    const [datalist, setDatalist] = useState([]);

    const [project, setProject] = useState([]);
    const [techemployee, setTechemployee] = useState([]);

    const [{ fullName, clientName, projectName }, setUpdate] = useState({
        fullName: "",
        clientName: "",
        projectName: ""
    });

    const navigate = useNavigate();
    const [date, setDate] = useState(initialDate);
    const [dayRate, setDayRate] = useState(0);
    const [TypeOfRate, setTypeOfRate] = useState("");

    const [days, setDays] = useState(0);
    const [monthdayhour, setMonthdayhour] = useState("");

    let {
        fromDate,
        toDate,
    } = date;

    useEffect(() => {

        setDayRate(window.localStorage.getItem("DAY_RATE"))

        setTypeOfRate(window.localStorage.getItem("TYPE_OF_RATE"))

        setDate({
            fromDate: moment(window.localStorage.getItem("FROM_DATE")).format('YYYY-MM-DD'),
            toDate: moment(window.localStorage.getItem("TO_DATE")).format('YYYY-MM-DD'),
        })

        setUpdate({
            fullName: window.localStorage.getItem("EMPLOYEE_NAME"),
            clientName: window.localStorage.getItem("CLIENT_NAME"),
            projectName: window.localStorage.getItem("PROJECT_NAME"),
        })

    }, [])


    const inputHandle = (e) => {
        setUpdate(data => ({ ...data, fullName: e.target.value }));
    }

    const handleType = (e) => {
        setTypeOfRate(e.target.value)
    }

    const handleRate = (e) => {
        setDayRate(e.target.value)
    }

    const inputHandleDays = (e) => {
        setDate({
            ...date,
            [e.target.name]: [e.target.value]
        })
    }

    const inputHandleDays1 = (e) => {
        setDate({
            ...date,
            [e.target.name]: [e.target.value]
        })
    }

    const inputHandleTypeOfRate = (e) => {
        setTypeOfRate(e.target.value)

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

    function handleProjectChange(event) {
        setUpdate(data => ({ ...data, projectName: event.target.value }));
    }

    function handleClientChange(event) {
        setUpdate(data => ({ projectName: '', clientName: event.target.value }));
    }


    const handleEditClient = (e) => {
        e.preventDefault();
        axios.put(`${global.API_URL}/smg/billing/editBillingRateById/${localStorage.getItem("BILL_ID")}`, {
            fullName: `${fullName}`,
            clientName: `${clientName}`,
            projectName: `${projectName}`,
            fromDate: `${fromDate}`,
            toDate: `${toDate}`,
            rate: `${dayRate}`,
            rateType: `${TypeOfRate}`
        }, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                console.log("response", res.data);
                toast.success("Billing Info Updated Successfully")
                navigate("/profilepage/billing")
            })
            .catch((err) => {
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
                // console.log("Fetch successfully", data);
                let result = data.filter(items => items.projectStatus !== "Completed")
                setProject(result);
            }).catch((err) => {
                console.log("some error", err);
            })
        }

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

        GetProjectDetails();
        GetEmpDetails();
        // GetAssignData();
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


    // const datediffFn = () => {

    //     const d1 = document.getElementById("firstdate").value;
    //     const d2 = document.getElementById("seconddate").value;
    //     const Date1 = new Date(d1);
    //     const Date2 = new Date(d2);

    //     const time = Math.abs(Date2 - Date1);
    //     const DaysDiff = Math.ceil(time / (1000 * 60 * 60 * 24))

    //     document.getElementById("DAYS").innerHTML = DaysDiff
    //     setDaysDifference(DaysDiff);
    // }

    // const TotaldaysFn = () => {
    //     const d1 = document.getElementById("DAYS").value;
    //     const d2 = document.getElementById("TotalLeaves").value;
    //     const totalDays = d1 - d2;
    //     setTotalDays(totalDays);
    // }

    // const TotalAmountFn = () => {

    //     const totalDays = document.getElementById("TotalDays").value;
    //     const PerDayRate = document.getElementById("PerDayRate").value;

    //     const TotalAmt = totalDays * PerDayRate;
    //     setTotalAmount(TotalAmt)

    // }

    const handlecancel = () => {
        navigate("/profilepage/billing")
    }

    return (
        <div>
            <div>
                <form onSubmit={handleEditClient}>
                    <h5>Billing</h5>
                    <div className='mainWrapper'>
                        <div className='innerone'>
                            <div>
                                <label className='form-label'> Employee Name <sup>*</sup></label>
                                <select name="fullName" value={fullName} onChange={inputHandle} className='form-select w-75'>
                                    <option>select</option>
                                    {
                                        techemployee.map((element) => {
                                            return <option key={element.empId}>{element.fullName}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className='DateRow'>
                                <div className='inneronerow'>
                                    <label className='form-label'>From Date <sup>*</sup></label>
                                    <input id="firstdate" name="fromDate" value={fromDate} onChange={inputHandleDays} type="date" className="form-control w-75" />

                                </div>
                                <div className='inneronerow'>
                                    <label className='form-label'>To Date</label>
                                    <input id="seconddate" name="toDate" value={toDate} onChange={inputHandleDays1} type="date" className="form-control w-75" />

                                </div>
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
                            <div className='inneronerow'>
                                <label className='form-label'>Type of Rate</label>
                                <select className='form-select w-75' value={TypeOfRate} name="TypeOfRate" id='TypeOfRate' onChange={handleType}>
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
                                <label className='form-label'>Rate/{monthdayhour}<sup>*</sup></label>
                                <input type='text' id="PerDayRate" value={dayRate} name="dayRate" onChange={handleRate} className='form-control w-75' />
                            </div>
                        </div>
                    </div>

                    <div className='btngroupBilling'>
                        <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }}>Submit</button>
                        <button className='btn fw-bold' onClick={handlecancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

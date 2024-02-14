import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Select from 'react-select'

export default function PiechartData() {

    const [data, setData] = useState([]);

    // const newDate = new Date();
    const month = new Date().getMonth();
    const Year = new Date().getFullYear();

    const [optionList, setOptionList] = React.useState([]);
    const [client, setClient] = React.useState("");
    const defaultValueClient = (optionList.map((data) => (data.clientName))).join()

    const [fromDate, setFromDate] = useState(`${Year}-${(month + 1)}-01`);
    const [toDate, setToDate] = useState(`${Year}-${(month + 1)}-31`);

    const COLORS = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    const handleFromDate = (e) => {
        setFromDate(e.target.value);
        if ((Math.abs(new Date(document.getElementById("firstdate").value))) > (Math.abs(new Date(document.getElementById("seconddate").value)))) {
            window.confirm(`From Date should be less than To Date `)
            { (setFromDate(fromDate)) }
        }
    }
    const handleToDate = (e) => {
        setToDate(e.target.value);
        if ((Math.abs(new Date(document.getElementById("seconddate").value))) < (Math.abs(new Date(document.getElementById("firstdate").value)))) {
            window.confirm(`To Date should be greater than From Date `)
            { (setToDate(toDate)) }
        }
    }

    const handlePiechart = (e) => {
        e.preventDefault();
        axios.get(`${global.API_URL}/smg/billing/getPieData?fromDate=${fromDate}&toDate=${toDate}&clientName=${client}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log("error", err);
            })
    }

    const GetClientDetails = () => {
        axios.get(`${global.API_URL}/smg/client/getAllClientDetails`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res) => {
            // console.log("ListData fetched", res.data);
            setOptionList(res.data)
        }).catch((err) => {
            console.log("some error", err);
        })
    }

    const handlePiechart2 = (e) => {
        axios.get(`${global.API_URL}/smg/billing/getPieData?fromDate=${fromDate}&toDate=${toDate}&clientName=${defaultValueClient}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log("error", err);
            })
    }

    useEffect(() => {
        handlePiechart2();
    }, [defaultValueClient])

    useEffect(() => {
        GetClientDetails();
    }, [])


    let totalAmount = 0;
    data.forEach(function (data) {
        totalAmount = totalAmount + data.amount;
    })

    let totalEmployee = 0;
    data.forEach(function (data) {
        totalEmployee = totalEmployee + data.emp;
    })

    return (
        <>
            <div className='ProjectField' >
                <div >
                    <label className='form-label'>Start Date <sup className='star'>*</sup></label>
                    <input type="date" id='firstdate' value={fromDate} name="fromDate" onChange={handleFromDate} className="form-control " />
                </div>
                <div>
                    <label className='form-label'>End Date <sup className='star'>*</sup></label>
                    <input type="date" id='seconddate' value={toDate} name="toDate" onChange={handleToDate} className="form-control " />

                </div>
                <div>
                    <label className='form-label'> Client Name <sup className='star'>*</sup></label>
                    <select value={client} name="client" onChange={(e) => setClient(e.target.value)} className="form-select" >
                        <option></option>
                        {optionList.map((data, index) => {
                            return (
                                <option key={index}>{data.clientName}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <button className='btn btn-success  Btn' onClick={handlePiechart}>Search</button>
                </div>
                <div>
                    <button className='btn btn-success  Btn' onClick={handlePiechart2}>Get All</button>
                </div>
            </div>

            <hr />
            <div style={{ display: "flex" }}>
                <div>
                    <h5>
                        Total Amount : {totalAmount}
                    </h5>
                    <PieChart width={400} height={400}>
                        <Pie data={data} dataKey="amount" nameKey="clientName" color='#000000' cx="50%" cy="50%" outerRadius={140} fill="#8884d8" >
                            {data.map((data, index) => {
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                )
                            })}
                        </Pie>
                        <Tooltip>
                            {data.clientName}: {data.amount}
                        </Tooltip>
                        <Legend />
                    </PieChart>
                </div>
                <div>
                    <h5>
                        No of Employee : {totalEmployee}
                    </h5>
                    <PieChart width={400} height={400}>
                        <Pie data={data} dataKey="emp" nameKey="clientName" color='#000000' cx="50%" cy="50%" outerRadius={140} fill="#8884d8" >
                            {data.map((data, index) => {
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                )
                            })}
                        </Pie>
                        <Tooltip>
                            {data.clientName}: {data.emp}
                        </Tooltip>
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </>
    )
}

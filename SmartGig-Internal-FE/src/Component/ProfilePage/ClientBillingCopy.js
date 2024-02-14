import axios from 'axios';
import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import Pagination from './Pagination/Pagination';


let PageSize = 15

export default function ClientBilling() {
    const [currentPage, setCurrentPage] = useState(1);
    const heading = ['Client Name', 'Project Name', 'Amount', 'Total Employee', 'Start-Date', 'End-Date'];
    const month = new Date().getMonth();
    const Year = new Date().getFullYear();
    const [optionList, setOptionList] = React.useState([]);
    const [error, setError] = useState(false);
    const [assigndata, setAssigndata] = useState([]);
    const [fromDate, setFromDate] = useState(`${Year}-${(month + 1)}-01`);
    const [toDate, setToDate] = useState(`${Year}-${(month + 1)}-31`);
    const [clientName, setClientName] = useState()
    var clint = (optionList.map((data) => (data.clientName))).join()


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return assigndata.slice(firstPageIndex, lastPageIndex);

    }, [currentPage, assigndata]);

    const oninputChange1 = (e) => {
        setClientName(e.target.value)
    }
    const oninputChange2 = (e) => {
        setFromDate(e.target.value)

        if ((Math.abs(new Date(document.getElementById("firstdate").value))) > (Math.abs(new Date(document.getElementById("seconddate").value)))) {
            window.confirm(`From Date should be less than To Date `)
            { (setFromDate(fromDate)) }
        }
    }

    const oninputChange3 = (e) => {
        setToDate(e.target.value)
        if ((Math.abs(new Date(document.getElementById("seconddate").value))) < (Math.abs(new Date(document.getElementById("firstdate").value)))) {
            window.confirm(`To Date should be greater than From Date `)
            { (setToDate(toDate)) }
        }
    }

    const handleClientBilling = (e) => {
        e.preventDefault();
        if (!clientName || !fromDate || !toDate) {
            setError(true);
            return false;
        }
        axios.get(`${global.API_URL}/smg/billing/getBillTable?clientName=${clientName}&fromDate=${fromDate}&toDate=${toDate}`,
            {
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

    useEffect(() => {
        GetClientDetails();
    }, [])

    const handleClientBilling2 = (e) => {
        axios.get(`${global.API_URL}/smg/billing/getBillTable?clientName=${clint}&fromDate=${fromDate}&toDate=${toDate}`,
            {
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

    useEffect(() => {
        handleClientBilling2();
    }, [clint])


    return (
        <div>
            <form onSubmit={handleClientBilling}>
                <div className='formWrapper' >
                    <div>
                        <label className='form-label'>Select Client</label>
                        <select className='form-select' value={clientName} name="clientName" onChange={oninputChange1}>
                            <option>Select</option>
                            {
                                optionList.map((list) => {
                                    return <option key={list.clientId} >{list.clientName}</option>
                                })
                            }
                        </select>
                        {error && !clientName && <p className='errormsg'>Please Select Client</p>}
                    </div>
                    <div>
                        <label className='form-label'>Onboarding Date</label>
                        <input type='date' id='firstdate' className='form-control' value={fromDate} name="fromDate" onChange={oninputChange2} />
                        {error && !fromDate && <p className='errormsg'>Enter date</p>}
                    </div>
                    <div>
                        <label className='form-label'>End Date</label>
                        <input type='date' id='seconddate' className='form-control' value={toDate} name="toDate" onChange={oninputChange3} />
                        {error && !toDate && <p className='errormsg'>Enter date</p>}
                    </div>
                    <div>
                        <button type='submit' className='btn btn-success Btn'>Search</button>
                    </div>
                    <div>
                        <button type='submit' className='btn btn-success Btn' onClick={handleClientBilling2}>Get All</button>
                    </div>
                </div>
            </form >

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
                            currentTableData.map((data, index) => {
                                return <tr key={index}  >
                                    <td >{data.clientName}</td>
                                    <td >{data.projectName}</td>
                                    <td >{data.amount}</td>
                                    <td >{data.emp}</td>
                                    <td >{moment(data.fromDate).format('MMM Do, YYYY')}</td>
                                    <td >{moment(data.toDate).format('MMM Do, YYYY')}</td>
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
        </div >
    )
}

import axios from 'axios';
import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import Pagination from './Pagination/Pagination';
import * as XLSX from 'xlsx';
import "../API/api"

let PageSize = 15

export default function ClientBilling() {
    const [currentPage, setCurrentPage] = useState(1);
    const heading = ['Client Name', 'Project Name', 'Project-Status', 'Project-StartDate', 'Project-EndDate'];
    const month = new Date().getMonth();
    const Year = new Date().getFullYear();
    const [optionList, setOptionList] = useState([]);
    const [sortOrder, setSortOrder]= useState('asc');


    const [assigndata, setAssigndata] = useState([]);

    const [searchNo, setSearchNo] = useState('')
    const [billingData, setBillingData] = useState([]);
    const [filterdata, setFilterData] = useState([])
    const [projectState, setProjectState] = useState('');
    const [clientState, setClientState] = useState('');
    const [statusState, setStatusState] = useState('');
    const [sum, setSum] = useState('')
    const [billingsum, setBillingsum] = useState('')
    var clint = (optionList.map((data) => (data.clientName))).join()


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return assigndata.slice(firstPageIndex, lastPageIndex);

    }, [currentPage, assigndata]);

    const sorting = () => {
        let sortedData = [...assigndata];
        if (sortOrder === "asc") {
            sortedData.sort((a, b) => a.emp - b.emp && a.amount - b.amount);
            setSortOrder("desc");
        } else {
            sortedData.sort((a, b) => b.emp - a.emp && b.amount - a.amount);
            setSortOrder("asc");
        }
        setAssigndata(sortedData);
    };

    const handleClientBilling = (e) => {
        axios.get(`${global.API_URL}/smg/billing/getClientBill`,
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
                }
            })
            .then((res) => {
                setAssigndata(res.data)
                setBillingData(res.data)
                const sum = res.data.reduce((acc, item) => acc + item.emp, 0);
                const billingsum = res.data.reduce((acc, item) => acc + item.amount, 0);
                setSum(sum)
                setBillingsum(billingsum)
            })
            .catch((err) => {
                console.log("err", err);
            })
    }

    useEffect(() => {
        handleClientBilling();
    }, [])


    const searchStatus = (e) => {
        const getStatus = e.target.value;
        if (getStatus.length > 0) {
            const searchData = billingData.filter((data) =>
                data.projectStatus.toLowerCase().includes(getStatus)
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
        }
        else {
            setAssigndata(billingData);
        }

        setClientState(getclient);
    };

    const exportSheet = () => {
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(assigndata);
        XLSX.utils.book_append_sheet(wb, ws, "ClientBillingData");
        XLSX.writeFile(wb, "ClientBillingData.xlsx");
    }

    return (
        <div>

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
                    placeholder="Search By Project Status"
                    name="statusState"
                    value={statusState}
                    onChange={searchStatus}
                />

                <button className="btn btn-outline-dark btn-sm" onClick={exportSheet}>
                    Export Sheet
                </button>
            </div>
            <hr />
            <p>Total no.of billable-{sum}</p>
            <p>Total billing amount-{billingsum} </p>
            <div className='Border'>
                <table className="table table-sm table-hover mb-0 tablecontent">
                    <thead>
                        <tr>
                          {
                                heading.map((data, index) => (

                                    <th key={index} style={{ fontWeight: '600', color: '#252F40' }}>{data}</th>

                                ))
                            }
                            <th onClick={() => sorting('emp')}><span className='me-2'>Total Employee</span> <span className="bi bi-arrow-down-up"></span></th>
                            <th onClick={() => sorting('amount')}><span className='me-2'>Amount</span> <span className="bi bi-arrow-down-up"></span></th>
                           
                        </tr>

                    </thead>
                    <tbody >
                        {
                            currentTableData.map((data, index) => {
                                return <tr key={index}  >
                                    <td >{data.clientName}</td>
                                    <td >{data.projectName}</td>
                                    <td >{data.projectStatus}</td>
                                    <td >{moment(data.projectStartSate).format('MMM Do, YYYY')}</td>
                                    <td >{moment(data.projectEndDate).format('MMM Do, YYYY')}</td>
                                    <td >{data.emp}</td>
                                    <td >{data.amount}</td>
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

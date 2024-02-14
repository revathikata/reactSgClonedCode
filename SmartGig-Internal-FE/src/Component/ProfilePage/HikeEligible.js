import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import "../API/api"
import moment from 'moment';
import Tooltip from '@mui/material/Tooltip';
import Pagination from './Pagination/Pagination';


let PageSize = 15


const HikeEligible = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hikedata, setHikeData] = useState([]);
  const heading = ['EmpID', 'Full Name',  'Email', 'DOJ', 'Work Location', 'Role',  'Fixed CTC', 'Variable Pay', 'CTC']

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return hikedata.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, hikedata]);

  useEffect(() => {
    axios.get(`${global.API_URL}/smg/employee/hikeEligibility`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      } 
    }).then((res) => {
      console.log(res.data)
      setHikeData(res.data)
    }).catch((error) => {
      console.log("Got Error", error)
    })

  }, [])

  return (
    <div>
      <h5>Eligible Employee</h5>
      <hr />
      <div className='Border mb-2'>
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
          <tbody className='TBody'>
            {
              currentTableData.map((items, index) => {
                return <tr key={index}>
                  <td>{items.empId}</td>
                  <td style={{ width: '15%' }}>{items.fullName}</td>
                  <Tooltip title={items.email}>
                    <td>{items.email.substring(0, items.email.lastIndexOf("@"))}</td>
                  </Tooltip>
                  <td>{moment(items.dateOfJoining).format("DD-MM-YYYY")}</td>
                  <td>{items.primaryLocation}</td>
                  <td style={{ width: '15%' }}>{items.role}</td>
                  <td>{items.fixedCtc}</td>
                  <td>{items.variablePay}</td>
                  <td>{items.ctc}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={hikedata.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={hikedata}
        />
      </div>
    </div>
  );
}

export default HikeEligible;

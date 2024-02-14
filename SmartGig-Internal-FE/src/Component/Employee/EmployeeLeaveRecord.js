import axios from 'axios';
import React, {useState, useEffect} from 'react';


const EmployeeLeaveRecord = () => {
  const [id, setId] = useState(window.localStorage.getItem("ADMIN_ID"))
  const [leaveHistory, setLeaveHistory] = useState([])
  const heading = ['LeaveType', 'Subject', 'FromDate', 'ToDate', 'TotalDays']


  useEffect(() => {
    axios.get(`${global.API_URL}/smg/employee/getEmployeeLeaveHistoryById/${id}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res)=>{
      console.log(res.data)
      setLeaveHistory(res.data)
    })
      .catch(error => {
        console.log(error);
      });

  }, []);

  // 
  return (
    <div>
      <h4>Leave History</h4>
      <div className='Border table-responsive mt-4 mb-3'>
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
              leaveHistory.map((data, index) => {
                return <tr key={index}  >
                  <td>{data.leaveType}</td>
                  <td>{data.leaveSub}</td>
                  <td>{data.from}</td>
                  <td>{data.to}</td>
                  <td>{data.totalDays}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeLeaveRecord;

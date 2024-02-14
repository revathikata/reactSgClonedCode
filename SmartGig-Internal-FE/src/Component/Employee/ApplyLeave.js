import React, { useState, useEffect } from 'react'
import './Employee.css'
import "../API/api"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function ApplyLeave() {
  const navigate = useNavigate()
  const [id, setId] = useState(window.localStorage.getItem("ADMIN_ID"))
  const [leavesubject, setLeavesubject] = useState('');
  const [totaldays, setTodayDays] = useState('');
  const [fromdate, setFromDate] = useState('');
  const [todate, setToDate] = useState('');
  const [leavetype, setLeaveType] = useState('');
  const [data, setData] = useState({})

  // ;

  useEffect(() => {
    axios.get(`${global.API_URL}/smg/employee/getEmployeeLeaveById/${id}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      console.log(res.data)
      setData(res.data)
    })
      .catch(error => {
        console.log(error);
      });

  }, []);


  const applyLeave = (e) => {
    e.preventDefault();
    axios.post(`${global.API_URL}/smg/employee/empLeaveApply`, {
      employeeDetailsId: `${id}`,
      fromDate: `${fromdate}`,
      leaveSubject: `${leavesubject}`,
      leaveType: `${leavetype}`,
      toDate: `${todate}`,
      totalDays: `${totaldays}`
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      console.log("applied", res.data)
      toast.success("Leave Applied")
      navigate('/employeeProfile/leavehistory')

    }).catch((error) => {
      toast.error("Something went wrong")
      console.log("Leave apply error", error)
    })
  }

  return (
    <div className='container'>
      <h5 disabled>Apply Leave</h5>
      <div className='d-flex'>
        <div className='me-5 totalleave'>
          <div>
            <div>Leave</div>
            <h6>Total Available: {data.totalPaidLeavesAvailable}</h6>
            <h6>Total Used: {data.totalPaidLeavesAvailed}</h6>

            <div>
            </div>
          </div>
          <div className='IconImage'>
            {/* <img src={'https://smartgig-internal-project.s3.ap-south-1.amazonaws.com/birthday+templates/Vector(2).png'} /> */}
          </div>
        </div>
        <div className='me-5 totalleave'>
          <div>
            <div>Available Leave</div>
            <h6>Casual Leave: {data.casualAvailable}</h6>
            <h6>Sick Leave: {data.sickAvailable}</h6>
          </div>
          <div className='IconImage'>
            {/* <img src={'https://smartgig-internal-project.s3.ap-south-1.amazonaws.com/birthday+templates/Group+36178.png'} /> */}
          </div>
        </div>
        <div className='totalleave me-5'>
          <div>
            <div>Used Leave</div>
            <h6>Casual Leave: {data.casualAvailed}</h6>
            <h6>Sick Leave: {data.sickAvailed}</h6>
          </div>
          <div className='IconImage'>
            {/* <img src={'https://smartgig-internal-project.s3.ap-south-1.amazonaws.com/birthday+templates/Group+36179.png'} /> */}
          </div>
        </div>
        <div className='totalleave'>
          <div>
            <div>LOP</div>
            <h6>LOP: {data.lop}</h6>
          </div>
          <div className='IconImage'>
            {/* <img src={'https://smartgig-internal-project.s3.ap-south-1.amazonaws.com/birthday+templates/Group+36179.png'} /> */}
          </div>
        </div>
      </div>
      <div >
        <form onSubmit={applyLeave}>
          <div className='leavefields'>
            <div>
              <label className='form-label'>Leave Subject</label>
              <input type="text" className='form-control' onChange={(e) => setLeavesubject(e.target.value)} value={leavesubject} name='leavesubject' placeholder='Enter leave subject' />
            </div>
            <div>
              <label className='form-label'>Total Days</label>
              <input type="number" className='form-control' value={totaldays} name='totaldays' placeholder='Enter total days' onChange={(e) => setTodayDays(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>From Date<sup>*</sup></label>
              <input type="date" className='form-control' value={fromdate} name='fromdate' onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>To Date<sup>*</sup></label>
              <input type="date" className='form-control' value={todate} name='todate' onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div>
              <label className='form-label'>Leave Type</label>
              <select className='form-select' name='leavetype' onChange={(e) => setLeaveType(e.target.value)}>
                <option></option>
                <option value='Sick'>Sick Leave</option>
                <option value='Casual'>Casual Leave</option>
              </select>
            </div>
            <button type='submit' className='btn btn-outline-success me-1  Btn'>Apply</button>
            <button className='btn btn-outline-danger  Btn'>Cancel</button>
          </div>
        </form >

      </div >
      <hr />
    </div>
  )
}

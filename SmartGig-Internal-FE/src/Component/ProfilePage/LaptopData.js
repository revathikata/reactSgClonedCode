import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "../API/api"
import { useNavigate } from 'react-router-dom';

const laptopinitialData = {
  issueDate: '',
  replaceDate: '',
  returnDate: '',
  returnStatus: false
}

const LaptopData = () => {
  const [status, setStatus] = useState(true)
  const [laptopData, setLaptopData] = useState(laptopinitialData)
  const [laptopId, setLaptopId] = useState('')
  const [employeeDetailsId, setEmployeeDetailsId] = useState()
  const [laptopserialNo, setLaptopserialNo] = useState([])
  const { issueDate, replaceDate, returnDate, returnStatus } = laptopData
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  useEffect(() => {
    const employeeId = window.localStorage.getItem("EDIT_ID")
    setEmployeeDetailsId(employeeId)
  })


  useEffect(() => {

    axios.get(`${global.API_URL}/smg/laptop/laptopStock`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      console.log('Get data', response.data)
      setLaptopserialNo(response.data)

    }).catch((error) => {
      console.log("error while fetching data", error)
    })
  }, [])

  const handlelaptopValues = (e) => {
    setLaptopData({
      ...laptopData,
      [e.target.name]: [e.target.value],
    })

  }

  const laptopDatahandle = (e) => {
    e.preventDefault()
    if (!laptopId || !issueDate) {
      setError(true);
      return false;

    }
    axios.post(`${global.API_URL}/smg/assignedLap/assignedLap`, {
      employeeDetailsId: `${employeeDetailsId}`,
      issueDate: `${issueDate}`,
      laptopId: `${laptopId}`,
      replaceDate: `${replaceDate}`,
      returnDate: `${returnDate}`,
      returnStatus: `${returnStatus}`,
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      if (response.data.msg == "assigned") {
        console.log(response)
        toast.success("Laptop Issued ")
      }
      else if (response.data.msg == "already assigned") {
        window.confirm("Laptop Already Assigned")
        toast.warning("Laptop Already Assigned ")
      }
      navigate("/profilepage/employeelist")
    }).catch((err) => {
      toast.error("Something went wrong")
    })
  }



  const handleCancel = (e) => {
    e.preventDefault()
    axios.post(`${global.API_URL}/smg/assignedLap/assignedLap`, {
      employeeDetailsId: `${employeeDetailsId}`,
      issueDate: '',
      laptopId: '',
      replaceDate: '',
      returnDate: '',
      returnStatus: '',
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      navigate("/profilepage/employeelist")
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  return (
    <div className='container'>
      <h5>Laptop</h5>
      <form className="upload--container" onSubmit={laptopDatahandle}>
        <div className='mainWrapper'>
          <div className='inneroneD'>
            <div>
              <label className='form-label'> Serial No </label>
              <select className='form-select w-50' name='laptopId' onChange={(e) => setLaptopId(e.target.value)}>
                <option></option>
                {
                  laptopserialNo.map((srNo, index) => {
                    return <option key={index} value={srNo.id}>{srNo.srNo}</option>
                  })
                }
              </select>
              {error && !laptopId && <p className='errormsg'>Please Enter Sr.No</p>}

            </div>

          </div>
          <div className='inneroneD'>
            <div>
              <label className='form-label'>Issue Date</label>
              <input type="date" name='issueDate' value={issueDate} onChange={handlelaptopValues} className='form-control w-50' />
              {error && !issueDate && <p className='errormsg'>Please Select Date</p>}

            </div>
            <div className='FormbtngroupHL'>
              <button className='btn me-2' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
              <button className='btn fw-bold' type='button' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={handleCancel}>Skip to Home</button>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}

export default LaptopData;

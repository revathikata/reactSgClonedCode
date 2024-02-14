import axios from 'axios';
import React, { useState, useEffect } from 'react';


const BillingData = () => {
  const [employee, setEmployee] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employeeName, setEmployeeName] = useState("");

  const AllEmployee = employee.map((data) => (data.fullName)).join()

  const [billingdata, setBillingData] = useState([])
  const heading = ['Emp ID', 'Employee Name', "CTC", "Actual Year CTC", 'P&L']



  useEffect(() => {
    const GetEmpDetails = () => {
      axios.get(`${global.API_URL}/smg/employee/getTechEmp`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((res) => {
        setEmployee(res.data)
      }).catch((err) => {
        console.log("some error", err);
      })
    }

    GetEmpDetails()
  }, [])


  const BillinData = (e) => {
    axios.get(`${global.API_URL}/smg/billing/getPLReports`, {
      params: {
        empName: `${AllEmployee}`,
        year: `${year}`
      },
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      setBillingData(res.data)
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  useEffect(() => {
    BillinData()
  }, [AllEmployee])

  const BillingDataForSort = (e) => {
    e.preventDefault();
    axios.get(`${global.API_URL}/smg/billing/getPLReports?empName=${employeeName}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      setBillingData(res.data)
    }).catch((err) => {
      console.log("some error", err);
    })
  }



  return (

    <div>
      <form >
        <h5>Employee Expenses</h5>
        <div className='formWrapper'>
          <div className='w-25'>
            <label className='form-label'>Employee Name <sup className='star'>*</sup></label>
            <select className='form-select' name='employeeName' value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} >
              <option>Select</option>
              {
                employee.map((element) => {
                  return <option key={element.employeeDetailsId}>{element.fullName}</option>
                })
              }
            </select>
          </div>
          <div>
            <label className='form-label'>Years</label>
            <select className='form-select' name='year' onChange={(e) => setYear(e.target.value)} value={year}>
              <option></option>
              <option >2021</option>
              <option >2022</option>
              <option >2023</option>
            </select>

          </div>
          <div>

          </div>
          <button type='button' onClick={BillingDataForSort} className='btn btn-success Btn'>Search</button>
          <button type='button' onClick={BillinData} className='btn btn-success Btn'>Get All</button>
        </div>
      </form>
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
          <tbody className='TBody'>
            {
              billingdata.map((value, index) => {
                return <tr key={index}  >
                  <td >{value.empId}</td>
                  <td >{value.empName}</td>
                  <td >{value.ctc}</td>
                  <td >{value.currentYearCtc}</td>
                  <>{value.profilAndLoss > 0 ? <td style={{ color: "green" }}> {value.profilAndLoss} </td> : <td style={{ color: "red" }}>{value.profilAndLoss}</td>}</>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillingData;

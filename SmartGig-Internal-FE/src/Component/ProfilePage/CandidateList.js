import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../API/api";
import Tooltip from '@mui/material/Tooltip';


const CandidateList = () => {
  const [data, setData] = useState([])
  const [status, setStatus] = useState('');
  const [role, setRole] = useState([])
  const [applyfor, setApplyfor] = useState('')
  const heading = ['Candidate Name', 'Contact No', 'EmailId', 'Applied For', 'Hr_Name', 'Experience', 'Status', 'Resume', 'Interview'];

  const GetCandidateData = () => {
    axios.get(`${global.API_URL}/smg/candidate/getAllCandidate`, {
      params:{
       status:'',
       role:''
      },
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      }).catch((error) => {
        console.log("error", error);
      })
  }

  useEffect(() => {
    
    const allRoles = ()=>{
      axios.get(`${global.API_URL}/smg/candidate/getAllrole`,{
        headers: {
          
            'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
       }).then((response)=>{
        console.log('Get data', response.data)
        setRole(response.data)
       }).catch((error)=>{
        console.log("error while fetching data", error)
       })
   }

   allRoles();
    GetCandidateData()
  }, [])


  const findDatabystatus = () => {
    axios.get(`${global.API_URL}/smg/candidate/getAllCandidate`, {
      params:{
      status:`${status}`,
      role:`${applyfor}`
      },
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      }).catch((error) => {
        console.log("error", error);
      })
  }

  const clearFilter = ()=>{
    setStatus('')
    setApplyfor('')
    GetCandidateData()
  }


  return (
    <>
      <label className='form-label fw-bold bi bi-search'>  By Status</label>
      <div className='d-flex p-3 justify-content-evenly'>
        <select className='form-select w-25 h-25' name='status' onChange={(e) => setStatus(e.target.value)} value={status}>
          <option></option>
          <option >Inprocess</option>
          <option >Selected</option>
          <option >Rejected</option>
        </select>
        <select className='form-select w-25' name='applyfor' onChange={(e)=> setApplyfor(e.target.value)} value={applyfor}>
          {
            role.map((list, index)=>{
              return <option key={index}>{list}</option>
            })
           }
        </select>
        <button type='submit'  onClick={findDatabystatus} className='btn btn-outline-success Btn ms-2' style={{marginTop:"-2px"}}>Search</button>
        <button type='submit'  onClick={clearFilter} className='btn btn-outline-danger Btn ms-2' style={{marginTop:"-2px"}}>Clear Filter</button>
      
      </div>

      <div id='addCandi'>
        <div className='Border table-responsive'>
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
                data.map((data) => {
                  return <tr key={data.id}  >
                    <Tooltip title='View Profile'>
                    <td ><Link to={"/hrProfile/candidateprofile/" + data.id} style={{ textDecoration: 'none' }}>{data.candidateName}</Link></td>
                    </Tooltip>
                    <td >{data.mobileNo}</td>
                    <Tooltip title={data.email}>
                    <td >{data.email.substring(0, data.email.lastIndexOf("@"))}</td>
                    </Tooltip>
                    <td >{data.appliedFor}</td>
                    <td >{data.candidateHr}</td>
                    <td >{data.totalExp}</td>
                    <td>{data.status}</td>
                    <td><a href={data.resume} style={{ textDecoration: 'none' }} target="_blank">Download</a></td>
                    <td><Link to={"/hrProfile/candidateinterview/" + data.id} style={{ cursor: 'pointer', textDecoration: 'none' }}>Schedule Interview</Link></td>
                    <Tooltip title='Edit'><td ><Link to={"/hrProfile/candidatelist/" + data.id} className='bi bi-pen-fill' style={{ cursor: 'pointer', color: 'black' }}></Link></td></Tooltip>
                    </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CandidateList;

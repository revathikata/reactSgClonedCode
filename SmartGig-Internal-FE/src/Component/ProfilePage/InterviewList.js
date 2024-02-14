import axios from 'axios';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';


const InterviewList = () => {
  const [interviewData, setInterviewdata] = useState([])
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [role, setRole] = useState('')
  const [allrole, setAllRole] = useState([])
  
  const heading = ['Date', 'Candidate_Name', 'Post', 'Interviewer', 'Interview_Mode', 'Time', 'Round', 'Status'];
 
  useEffect(()=>{
    const GetInterviewData = () => {
        axios.get(`${global.API_URL}/smg/interview/getAllInterviewDetails`, {
          params:{
            date:moment(date).format('YYYY-MM-DD'),
            role:`${role}`
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
          }
        })
          .then((res) => {
            console.log("DATA", res.data);
            setInterviewdata(res.data)
          }).catch((error) => {
            console.log("error", error);
          })
      }

      const allRoles = ()=>{
        axios.get(`${global.API_URL}/smg/candidate/getAllrole`,{
          headers: {
            
              'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
          }
         }).then((response)=>{
          console.log('Get data', response.data)
          setAllRole(response.data)
         }).catch((error)=>{
          console.log("error while fetching data", error)
         })
     }
     
     allRoles();
      GetInterviewData()
}, [])

const searchData = () => {
  axios.get(`${global.API_URL}/smg/interview/getAllInterviewDetails`, {
    params:{
      date:moment(date).format('YYYY-MM-DD'),
      role:`${role}`
    },
    headers: {
      'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
    }
  })
    .then((res) => {
      console.log("DATA", res.data);
      setInterviewdata(res.data)
    }).catch((error) => {
      console.log("error", error);
    })
}
  
  return (
    <div>
      <h5>Interview List</h5>
      <div className='d-flex justify-content-evenly'>
        <input type="date" className='form-control w-25 mb-2' name='date' value={date} onChange={(e)=> setDate(e.target.value  )} />
        <select className='form-select w-25 mb-2' name='role' value={role} onChange={(e)=> setRole(e.target.value)}>
            
           {
            allrole.map((list, index)=>{
              return <option key={index}>{list}</option>
            })
           }
           </select>
           <button type='submit' className='btn btn-outline-primary mb-2' onClick={searchData}>Search</button>
      </div>
      <div id='addCandi'>
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
              interviewData.map((data) => {
                return <tr key={data.id}  >
                  <td >{moment(data.date).format('MMM Do, YYYY')}</td>
                  <td ><Link to={"/hrProfile/candidateprofile/"+data.candidateId} style={{textDecoration:'none'}}>{data.candidateName}</Link></td>
                  <td>{data.appliedfor}</td>
                  <td >{data.interviewer}</td>
                  <td >{data.interviewType}</td>
                  <td>{data.time}</td>
                  <td>{data.interviewRound}</td>
                  <td >{data.interviewStatus}</td>
                  <Tooltip title='Edit'><td ><Link to={"/hrProfile/interviewedit/"+data.interviewId}  className='bi bi-pen-fill' style={{ cursor: 'pointer', color:'black'  }}></Link></td>   
                  </Tooltip> 
                  </tr>
              } )
            } <tr>
              
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default InterviewList;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import './Profile.css'
import "../API/api"



const CandidateProfilePage = () => {
  const [candidatename, setCandidatename] = useState('');
  const [primaryskill, setPrimaryskill] = useState('');
  const [secondaryskill, setSecondaryskill] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [alternativemob, setAlternativemob] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [currentorg, setCurrentorg] = useState('');
  const [experience, setExperience] = useState('');
  const [notioceperiod, setNotioceperiod] = useState('');
  const [noticemonths, setNoticemonths] = useState('');
  const [linkedin, setLinkedin] = useState("");
  const [post, setPost] = useState("");
  const [currentCtc, setCurrentctc] = useState('')
  const [expectedCtc, setExpectedCtc] = useState('');
  const [status, setStatus] = useState('');
  const [candidateHr, setCandidatehr] = useState('')

  const [interviewdata, setInterviewdata] = useState([]);


  const heading = ['Date', 'Round_Mode', 'Round', 'Interviewer', 'Time', 'Status'];


  const params = useParams()

  useEffect(() => {
    const GetCandidate = () => {
      axios.get(`${global.API_URL}/smg/candidate/getCandidateById/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          console.log(res)
          setCandidatename(res.data.candidateName)
          setPrimaryskill(res.data.primarySkill)
          setSecondaryskill(res.data.secondarySkill)
          setMobileno(res.data.mobileNo)
          setAlternativemob(res.data.alterNo)
          setEmail(res.data.email)
          setDob(res.data.dob)
          setCurrentorg(res.data.currentOrg)
          setExperience(res.data.totalExp)
          setNotioceperiod(res.data.isOnNoticePeriod)
          setNoticemonths(res.data.noticePeriod)
          setLinkedin(res.data.linkedinLink)
          setPost(res.data.appliedFor)
          setCurrentctc(res.data.currentCtc)
          setExpectedCtc(res.data.expectedCtc)
          setCandidatehr(res.data.candidateHr)
          setStatus(res.data.status)
        }).catch((error) => {
          console.log("error", error);
        })
    }

    const GetInterviewDetails = () => {
      axios.get(`${global.API_URL}/smg/interview/getInterviewDetails/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((response) => {
          console.log(response.data)
          setInterviewdata(response.data)
        }).catch((error) => {
          console.log("error", error);
        })
    }
    GetCandidate()
    GetInterviewDetails()
  }, []);
  return (
    <div className='container candidateProfile'>
      <h4>Candidate Profile</h4>
      <hr />
      <div className='row '>
        <label className='col col-lg-2'>Candidate Name :</label ><p className='col col-lg-3'>{candidatename}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Applied For :</label ><p className='col col-lg-3'>{post}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Contact :</label ><p className='col col-lg-3'>{mobileno}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Alternate Mobile_No :</label ><p className='col col-lg-3'>{alternativemob}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Email :</label ><p className='col col-lg-3'>{email}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>DOB :</label ><p className='col col-lg-3'>{moment(dob).utc().format('MMM Do, YYYY')}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Experience :</label ><p className='col col-lg-3'>{experience}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Notice Period :</label ><p className='col col-lg-3'>{notioceperiod}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Current Organization :</label ><p className='col col-lg-3'>{currentorg}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>CTC :</label ><p className='col col-lg-3'>{currentCtc}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2 form-label'>Expected CTC :</label ><p className='col col-lg-3'>{expectedCtc}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>primary_Skill :</label ><p className='col col-lg-3'>{primaryskill}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>secondary_Skill :</label ><p className='col col-lg-3'>{secondaryskill}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>Current_Status :</label ><p className='col col-lg-3'>{status}</p>
      </div>
      <div className='row'>
        <label className='col col-lg-2'>HR_Name :</label ><p className='col col-lg-3'>{candidateHr}</p>
      </div>
      <hr />
      <div>
        <h4>Interview Details</h4>
        <div className='Border mb-4'>
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
                interviewdata.map((items, index)=>{
                 return <tr key={index}>
                  <td >{moment(items.interviewDate).format('MMM Do, YYYY')}</td>
                  <td>{items.interviewType}</td>
                  <td>{items.interviewRound}</td>
                  <td>{items.interviewer}</td>
                  <td>{items.fromtime} To {items.totime} {items.amAndpm}</td>
                  <td>{items.interviewStatus}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfilePage;

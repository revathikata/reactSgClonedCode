import React, {useState, useEffect} from 'react';
import './Profile.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../API/api"
import axios from 'axios';
import moment from 'moment';

const InterviewEdit = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [candidateId, setCandidateId] = useState();
    const [interviewType, setInterviewType] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [todate, setTodate] = useState("");
    const [fromdate, setFromdate] = useState("");
    const [amAndpm, setAmAndpm] = useState('');
    const [interviewer, setInterviewer] = useState('');
    const [interviewRound, setInterviewRound] = useState('');
    const [roundStatus, setRoundStatus] = useState('');
    const [interviewStatus, setInterviewStatus] = useState('');
    const [comments, setComments] = useState('');
   
    const InterviewDetails=()=>{
      setInterviewDate("")
        axios.get(`${global.API_URL}/smg/interview/getInterview/${params.id}`,{
            headers: {
              'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
          })
            .then((res) => {
                console.log(res.data)
                setCandidateId(res.data.candidateId)
                setInterviewType(res.data.interviewType)
                setInterviewDate(moment(res.data.date).format('YYYY-MM-DD'));
                setTodate(res.data.totime)
                setFromdate(res.data.fromtime)
                setAmAndpm(res.data.amAndpm)
                setInterviewer(res.data.interviewer)
                setInterviewRound(res.data.interviewRound)
                setRoundStatus(res.data.roundStatus)
                setInterviewStatus(res.data.interviewStatus)
                setComments(res.data.comments)

            }).catch((error) => {
              console.log("error", error);
            })
        }

        useEffect(()=>{
            InterviewDetails()
        }, [])
     
        const EditInterview = (e)=>{
            e.preventDefault();
            axios.put(`${global.API_URL}/smg/interview/editInterviewDetails/${params.id}`, {
              candidateId:`${candidateId}`,
              interviewType:`${interviewType}`,
              interviewDate:`${interviewDate}`,
              fromtime:`${fromdate}`,
              totime:`${todate}`,
              amAndpm:`${amAndpm}`,
              interviewer:`${interviewer}`,
              interviewRound:`${interviewRound}`,
              roundStatus:`${roundStatus}`,
              interviewStatus:`${interviewStatus}`,
              comments:`${comments}`
            }, {
              headers: {
                  'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
              }
          }).then((res)=>{
            toast.success("Interviews details updated")
            navigate('/hrProfile/interviewlist')
            console.log("Successful", res.data)
          }).catch((err)=>{
            toast.error("Something went wrong")
            console.log("Error Occured", err)
          })

        }

        const CancelEdit=()=>{
          navigate('/hrProfile/interviewlist')
        }

  return (
    <div>
       <form onSubmit={EditInterview}>
        <h5>Edit Interview</h5>
        <div className='container mainWrapper'>
            <div className='innerone'>
            <label className='form-label'>Date<sup>*</sup></label>
            <input type='date' className='form-control w-50' value={interviewDate} name='interviewDate' onChange={(e)=> setInterviewDate(e.target.value)} />
            <label className='form-label'>From Time <sup>*</sup></label>
            <input type='text' className='form-control w-50' value={fromdate} name='fromdate' onChange={(e)=> setFromdate(e.target.value)}/>
            <label className='form-label'>To Time <sup>*</sup></label>
            <input type='text' className='form-control w-50' value={todate} name='todate' onChange={(e)=> setTodate(e.target.value)} />
           
            <label className='form-label'>AM/PM</label>
              <select className='form-select w-50' value={amAndpm} name='amAndpm' onChange={(e)=> setAmAndpm(e.target.value)}>
                <option></option>
                <option>AM</option>
                <option>PM</option>
              </select>
            <label className='form-label'>Interview Type <sup>*</sup></label>
            <select className='form-select w-50' value={interviewType} name='interviewType' onChange={(e)=> setInterviewType(e.target.value)}>
                <option></option>
                <option>Virtual</option>
                <option>Offline</option>
              </select>
             
            </div> 

            <div className='innerone'>
            <label className='form-label'>Interview Rounds<sup>*</sup></label>
            <select className='form-select w-50' value={interviewRound} name='interviewRound' onChange={(e)=> setInterviewRound(e.target.value)}>
                <option></option>
                <option>Technical 1</option>
                <option>Technical 2</option>
                <option>HR</option>
                <option>Managerial</option>
            </select>
            <label className='form-label'>Interviwer<sup>*</sup></label>
            <input type='text' className='form-control w-50' name='interviewer' value={interviewer} onChange={(e)=> setInterviewer(e.target.value)} />
            <label>Round Status<sup>*</sup></label>
            <select className='form-select w-50'name='roundStatus' value={roundStatus} onChange={(e)=> setRoundStatus(e.target.value)}>
                <option></option>
                <option>Pass</option>
                <option>Fail</option>
                <option>Pending</option>
            </select>
            <label>Final Status<sup>*</sup></label>
            <select className='form-select w-50'name='interviewStatus' value={interviewStatus} onChange={(e)=> setInterviewStatus(e.target.value)}>
                <option></option>
                <option>Pass</option>
                <option>Fail</option>
                <option>Pending</option>
            </select>
            <label className='form-label'>Comment</label>
            <textarea className='form-control w-50' value={comments} name="comments" onChange={(e)=> setComments(e.target.value)}></textarea>
            
            <div className='Candibtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Update</button>
                     <button className='btn fw-bold' type='button' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={CancelEdit}>Cancel</button>
            </div>
            </div>
           
        </div>
        
       </form>
    </div>
  );
}

export default InterviewEdit;

import axios from 'axios';
import React,{useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../API/api"
import { toast } from 'react-toastify';
import moment from 'moment';

const Interview = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [candidateId, setCandidateId] = useState(id);
    const [interviewType, setInterviewType] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [todate, setTodate] = useState("");
    const [fromdate, setFromdate] = useState("");
    const [amAndpm, setAmAndpm] = useState('');
    const [interviewer, setInterviewer] = useState('');
    const [interviewRound, setInterviewRound] = useState('');
    const [roundStatus, setRoundStatus] = useState(null);
    const [interviewStatus, setInterviewStatus] = useState('Pending');
    const [comments, setComments] = useState('');

   
   const scheduleInterview = (e)=>{
      e.preventDefault();
      axios.post(`${global.API_URL}/smg/interview/scheduleInterview`, {
        candidateId:`${candidateId}`,
        interviewType:`${interviewType}`,
        // interviewDate:`${interviewDate}`,
        interviewDate: moment(interviewDate).format("YYYY-MM-DD"),
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
      if(res.data.msg == "Interview round already scheduled"){
        toast.warning("Interview is already Scheduled")
      }else{
        toast.success("Interview Scheduled Successfully");
        navigate('/hrProfile/candidatelist')
      }
      console.log("Interview Scheduled", res.data)
    }).catch((e)=>{
      console.log("Error while scheduling interview", e)
    })
   }


    const handleCancle = () =>{
        navigate('/hrProfile/candidatelist')
    }


  return (
    <div>
       <form onSubmit={scheduleInterview}>
        <h5>Schedule Interview</h5>
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
            <label className='form-label'>Comment</label>
            <textarea className='form-control w-50' value={comments} name="comments" onChange={(e)=> setComments(e.target.value)}></textarea>
            
            <div className='Candibtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                    <button className='btn fw-bold' type='submit' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={handleCancle}>Cancel</button>
            </div>
            </div>
           
        </div>
        
       </form>
    </div>
  );
}

export default Interview; <form>
<div>
    <label className='form-label'>Date</label>
</div></form>
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import './Profile.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../API/api"
import moment from 'moment';

const CandidateEdit = () => {
  
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
  const [resume, setResume] = useState(null);
  const [linkedin, setLinkedin] = useState("");
  const [post, setPost] = useState("");
  const [currentCtc, setCurrentctc] = useState('')
  const [expectedCtc, setExpectedCtc] = useState('');
  const [status, setStatus] = useState('');
  const [candidateHr, setCandidatehr] = useState('')
  const [role, setRole] = useState([])


  const params = useParams();
  const navigate = useNavigate();
   
  useEffect(()=>{
    allRoles()
    GetCandi()
  }, [])

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
  
  const GetCandi=()=>{
    console.log(params)
    axios.get(`${global.API_URL}/smg/candidate/getCandidateById/${params.id}`,{
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          console.log(res.data)
            setCandidatename(res.data.candidateName)
            setPrimaryskill(res.data.primarySkill)
            setSecondaryskill(res.data.secondarySkill)
            setMobileno(res.data.mobileNo)
            setAlternativemob(res.data.alterNo)
            setEmail(res.data.email)
            setDob(moment(res.data.dob).format('YYYY-MM-DD'))
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
            setResume(res.data.resume)

        }).catch((error) => {
          console.log("error", error);
        })
    }

  
  const onFileupload = (e)=>{
    console.log(e.target.files)
    setResume(e.target.files[0])
  }
 
  const updateCandidate =(e)=>{
    
   e.preventDefault();
   
   
   const candidateForm = new FormData();
 
   candidateForm.append('resume', resume)

   candidateForm.append('candidateDetails', new Blob([JSON.stringify({
    candidateName:candidatename,
    primarySkill:primaryskill,
    secondarySkill:secondaryskill,
    mobileNo : mobileno,
    email : email,
    alterNo:alternativemob,
    dob:dob,
    currentOrg:currentorg,
    totalExp:experience,
    isOnNoticePeriod:notioceperiod,
    noticePeriod:noticemonths,
    linkedinLink:linkedin,
    appliedFor:post,
    candidateHr:candidateHr,
    currentCtc:currentCtc,
    expectedCtc:expectedCtc,
    status:status
})], {
    type : 'application/json',
  } )) 
 
   axios.put(`${global.API_URL}/smg/candidate/editCandidateDetails/${params.id}`, candidateForm,  {
    headers: {
      
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
    }
   }).then((res) => {
    toast.success("Candidate details updated")
    console.log("Candidate details successfull updated");
  })
    .catch((error) => {
      toast.error("Something went wrong");
    console.log("some error", error);
}) }

  
  const canclehandle = ()=>{
    navigate('/hrProfile/candidatelist')
  }

  const StatusChange = ()=>{
    axios.put(`${global.API_URL}/smg/candidate/changeStatus/${params.id}?status=${status}`, {}, {
      headers: {
        
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
     }).then((res) => {
     
      console.log("Candidate details successfull updated", res.data); 
      toast.success("Status Updated")
     })
      .catch((error) => {
       console.log("Error caught", error)
  })}

  return (
    <div className='CandiForm'>
       <form className='container-fluid'>
         <h5>Edit Details</h5>
         <div className='container mainWrapper'>
            <div className='innerone'>
            <label>Candidate Name</label>
           <input type='text' className='form-control w-75' name="candidatename" value={candidatename} onChange={(e)=> setCandidatename(e.target.value)}/>
           
           <label>Primary Skill</label>
           <select className='form-select w-75' name="primaryskill" value={primaryskill} onChange={(e)=> setPrimaryskill(e.target.value)}>
            <option>Select</option>
            <option>Java Developer</option>
            <option>DotNet Developer</option>
            <option>Angular Developer</option>
            <option>React Developer</option>
            <option>IOS Developer</option>
           </select>
           <label>Secondary Skill</label>
           <select className='form-select w-75' name="secondaryskill" value={secondaryskill} onChange={(e)=> setSecondaryskill(e.target.value)}>
            <option>Select</option>
            <option>Java Developer</option>
            <option>DotNet Developer</option>
            <option>Angular Developer</option>
            <option>React Developer</option>
            <option>IOS Developer</option>  
           </select>
           <label>Mobile No.</label>
           <input type='text' className='form-control w-75' name="mobileno" value={mobileno} onChange={(e)=> setMobileno(e.target.value)}/>
           <label>Alternate Mobile No</label>
           <input type='text' className='form-control w-75' name="alternativemob" value={alternativemob} onChange={(e)=> setAlternativemob(e.target.value)}/>
           <label>E-mail Id </label>
           <input type='email' className='form-control w-75' name="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
           <label>DOB </label>
           <input type='date' className='form-control w-75'name="dob" value={dob} onChange={(e)=> setDob(e.target.value)} />
           <label>Current Organization </label>
           <input type='text' className='form-control w-75' name="currentorg" value={currentorg} onChange={(e)=> setCurrentorg(e.target.value)}/>
           <label>Total Year's of exp </label>
           <input type='number' className='form-control w-75' name="experience" value={experience} onChange={(e)=> setExperience(e.target.value)}/>
           
        </div>
          <div className='innerone'>
           <label>Current CTC </label>
           <input type='text' className='form-control w-75' name="currentCtc" value={currentCtc} onChange={(e)=> setCurrentctc(e.target.value)}/>
           <label>Expected CTC </label>
           <input type='text' className='form-control w-75' name="expectedCtc" value={expectedCtc} onChange={(e)=> setExpectedCtc(e.target.value)}/>
           <label>Serving Notice Period </label>
           <select className='form-select w-75' name='notioceperiod' value={notioceperiod} onChange={(e)=> setNotioceperiod(e.target.value)}>
            <option></option>
            <option>Yes</option>
            <option>No</option>
           </select>
           <label>Notice Period [In Months]</label>
            <select className='form-select w-75' name="noticemonths" value={noticemonths} onChange={(e)=> setNoticemonths(e.target.value)}>
            <option></option>
            <option>1 </option>
            <option>2 </option>
           </select>
           <label>Upload Resume</label>
           <input type='file' className='form-control w-75'  onChange={onFileupload}/>
           <label>Linkedin Link</label>
           <input type='text' className='form-control w-75' name="linkedin" value={linkedin} onChange={(e)=> setLinkedin(e.target.value)}/>
           <label>Applied For</label>
           <select className='form-select w-75' name='post' value={post} onChange={(e)=> setPost(e.target.value)}>
            <option>Select</option>
           {
            role.map((list, index)=>{
              return <option key={index}>{list}</option>
            })
           }
           </select>
           <label>Select Status</label>
           <div className='d-flex'>
           <select className='form-select w-50' value={status} name='status' onChange={(e)=> setStatus(e.target.value)} >
                    <option></option>
                    <option  >Inprocess</option>
                    <option  >Selected</option>
                    <option  >Rejected</option>
                  </select>
                  <button type='button' className='btn btn-outline-success ms-5' onClick={StatusChange}>Update Status</button>
                  </div>
                  
           <div className='Candibtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} onClick={updateCandidate}>Update</button>
                    <button className='btn fw-bold' type="submit" style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={canclehandle}>Cancel</button>
            </div>
          </div>
         
         </div>
         
       </form>
    </div>
  );
}

export default CandidateEdit;

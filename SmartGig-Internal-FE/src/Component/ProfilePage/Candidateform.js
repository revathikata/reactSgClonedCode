import axios from 'axios';
import React, {useState, useEffect} from 'react';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Candidateform = () => {

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
  const [status, setStatus] = useState('Inprocess');
  const [candidateHr, setCandidatehr] = useState('')
  const [role, setRole] = useState([])
  const [error, setError] = useState(false)

  const navigate = useNavigate();
   useEffect(()=>{
    const adminName = window.localStorage.getItem("ADMIN_NAME")
    setCandidatehr(adminName)
    allRoles()
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

  const onFileupload = (e) => {
    // console.log(e.target.files)
    setResume(e.target.files[0])
  }
 
  const candidateData =(e)=>{
    
   e.preventDefault();
   
   if(!candidatename || !primaryskill || !mobileno || !email || !dob || !experience || !notioceperiod || !resume || !post || !expectedCtc ){
    setError(true);
    return false;
}
   
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
 
   axios.post(`${global.API_URL}/smg/candidate/saveCandidateDetails`, candidateForm,  {
    headers: {
      
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
    }
   }).then((res) => {
    console.log("Candidate details successfull uploaded", res.data);
    toast.success("Candidate Added successfully")
    navigate("/hrProfile/candidatelist");
   })
    .catch((error) => {
    console.log("some error during docs uplaod", error);
})

  }

  const canclehandle = ()=>{
    navigate('/hrProfile/candidatelist')
  }

  return (
    <div className='CandiForm'>
       <form className='container-fluid' onSubmit={candidateData}>
         <h5>Candidate Details</h5>
         <div className='container mainWrapper'>
            <div className='innerone'>
            <label>Candidate Name<sup>*</sup></label>
           <input type='text' className='form-control w-75' name="candidatename" value={candidatename} onChange={(e)=> setCandidatename(e.target.value)} placeholder='Enter Name'/>
           {error && !candidatename && <p className='errormsg'>Please Enter Candidate Name</p>}

           <label>Primary Skill<sup>*</sup></label>
           <select className='form-select w-75' name="primaryskill" value={primaryskill} onChange={(e)=> setPrimaryskill(e.target.value)}>
            <option>Select</option>
            <option>Java Developer</option>
            <option>DotNet Developer</option>
            <option>Angular Developer</option>
            <option>React Developer</option>
            <option>IOS Developer</option>
            <option>Tester</option>
           </select>
           {error && !primaryskill && <p className='errormsg'>Please Select Skill</p>}

           <label>Secondary Skill</label>
           <select className='form-select w-75' name="secondaryskill" value={secondaryskill} onChange={(e)=> setSecondaryskill(e.target.value)}>
            <option>Select</option>
            <option>Java Developer</option>
            <option>DotNet Developer</option>
            <option>Angular Developer</option>
            <option>React Developer</option>
            <option>IOS Developer</option>
           </select>

           <label>Mobile No.<sup>*</sup></label>
           <input type='text' className='form-control w-75' name="mobileno" value={mobileno} onChange={(e)=> setMobileno(e.target.value)} placeholder='Enter Mobile No'/>
           {error && !mobileno && <p className='errormsg'>Please Enter Mobile No</p>}
           
           <label>Alternate Mobile No</label>
           <input type='text' className='form-control w-75' name="alternativemob" value={alternativemob} onChange={(e)=> setAlternativemob(e.target.value)} placeholder='Enter alternative mobile no'/>
           <label>E-mail Id <sup>*</sup></label>
           <input type='email' className='form-control w-75' name="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter email_Id'/>
           {error && !email && <p className='errormsg'>Please Enter Email</p>}
          
           <label>DOB <sup>*</sup></label>
           <input type='date' className='form-control w-75'name="dob" value={dob} onChange={(e)=> setDob(e.target.value)} />
           {error && !dob && <p className='errormsg'>Please Enter Dob</p>}
          
           <label>Current Organization </label>
           <input type='text' className='form-control w-75' name="currentorg" value={currentorg} onChange={(e)=> setCurrentorg(e.target.value)} placeholder='Enter Organization'/>
          
        </div>
          <div className='innerone'>
          <label>Total Year's of exp <sup>*</sup></label>
           <input type='number' className='form-control w-75' name="experience" value={experience} onChange={(e)=> setExperience(e.target.value)}/>
           {error && !experience && <p className='errormsg'>Please Enter experience</p>}
           
           <label>Current CTC </label>
           <input type='text' className='form-control w-75' name="currentCtc" value={currentCtc} onChange={(e)=> setCurrentctc(e.target.value)} placeholder='Enter Current CTC'/>
           <label>Expected CTC <sup>*</sup></label>
           <input type='text' className='form-control w-75' name="expectedCtc" value={expectedCtc} onChange={(e)=> setExpectedCtc(e.target.value)} placeholder='Enter Expected CTC'/>
           {error && !expectedCtc && <p className='errormsg'>Please Enter CTC</p>}
          
           <label>Serving Notice Period <sup>*</sup></label>
           <select className='form-select w-75' name='notioceperiod' value={notioceperiod} onChange={(e)=> setNotioceperiod(e.target.value)}>
            <option></option>
            <option>Yes</option>
            <option>No</option>
           </select>
           {error && !notioceperiod && <p className='errormsg'>Please Select Yes/No</p>}
           
           <label>Notice Period [In Months]</label>
            <select className='form-select w-75' name="noticemonths" value={noticemonths} onChange={(e)=> setNoticemonths(e.target.value)}>
            <option></option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
           </select>
           <label>Upload Resume<sup>*</sup></label>
           <input type='file' className='form-control w-75'  onChange={onFileupload}/>
           {error && !resume && <p className='errormsg'>Please Upload File</p>}
           
           <label>Linkedin Link</label>
           <input type='text' className='form-control w-75' name="linkedin" value={linkedin} onChange={(e)=> setLinkedin(e.target.value)}/>
           <label>Applied For<sup>*</sup></label>
           <select className='form-select w-75' name='post' value={post} onChange={(e)=> setPost(e.target.value)}>
            <option>Select</option>
           {
            role.map((list, index)=>{
              return <option key={index}>{list}</option>
            })
           }
           </select>
           {error && !post && <p className='errormsg'>Please Select Post</p>}
         
           <div className='Candibtngroup'>
                    <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                    <button className='btn fw-bold' type='submit' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={canclehandle}>Cancel</button>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}

export default Candidateform;

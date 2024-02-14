import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import "../API/api"
import { useNavigate } from 'react-router-dom';

const SalaryComponent = () => {
    const [effectiveDate, setEffectiveDate] = useState('')
    const [employeeDetailsId, setEmployeeDetailsId] = useState('')
    const [hikeAmount, setHikeAmount] = useState('')
    const [hikeVariablePay, setHikeVariablePay] = useState('')
    const [totalctc, setTotalctc] = useState('')
    const [updatedOn, setUpdatedOn] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const employeeId = window.localStorage.getItem("EDIT_ID")
        setEmployeeDetailsId(employeeId)
    }, [])
 
    const hikeDatahandle = (e)=>{
        e.preventDefault()
        axios.post(`${global.API_URL}/smg/employee/hike`, {
            employeeDetailsId: `${employeeDetailsId}`,
            effectiveDate: `${effectiveDate}`,
            hikeAmount:`${hikeAmount}`,
            hikeVariablePay:`${hikeVariablePay}`,
            total_ctc:`${totalctc}`,
            updatedOn:`${updatedOn}`
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((response) => {
        toast.success("Hike data updated ")
        navigate("/profilepage/employeelist")
      }).catch((err) => {
        toast.error("Something went wrong")
      })
    }

    const handleCancel = () => {
        navigate("/profilepage/employeelist")
    }

  return (
    <div className='container'>
      <h5>Salary</h5>
      <form  className="upload--container" onSubmit={hikeDatahandle}>
            <div className='mainWrapper'>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'>Hike Effective Date</label>
                        <input type="date" name='effectiveDate' value={effectiveDate} onChange={(e)=> setEffectiveDate(e.target.value)} className='form-control w-50'  />
                    </div>
                    <div>
                        <label className='form-label'>Amount</label>
                        <input type="text" name='hikeAmount' value={hikeAmount} onChange={(e)=> setHikeAmount(e.target.value)}  className='form-control w-50' placeholder='Enter amount' />
                    </div>
                </div>
                <div className='inneroneD'>
                    
                    <div>
                        <label className='form-label'>Variable Amount</label>
                        <input type="text" name='hikeVariablePay' value={hikeVariablePay} onChange={(e)=> setHikeVariablePay(e.target.value)} className='form-control w-50' placeholder='Enter variable amount'  />
                    </div>
                    <div>
                        <label className='form-label'>Total CTC</label>
                        <input type="text" name='totalctc' value={totalctc} onChange={(e)=> setTotalctc(e.target.value)} className='form-control w-50' placeholder='Enter total ctc' />
                    </div>
                    <div className='FormbtngroupHL'>
                    <button className='btn me-2' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                    <button className='btn fw-bold' style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={handleCancel}>Cancel</button>
                </div>
                </div>  
        </div>
       
        </form>
    </div>
  );
}

export default SalaryComponent;
<h5>Salary</h5>
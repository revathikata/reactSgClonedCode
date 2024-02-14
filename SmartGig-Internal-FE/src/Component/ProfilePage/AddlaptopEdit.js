import axios from 'axios';
import React, {useState, useEffect,} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const AddlaptopEdit = () => {
    const navigate =  useNavigate()
    const params = useParams()
    const [laptoptype, setLaptoptype] = useState('');
    const [srNo, setSrNo] = useState('');
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [processor, setProcessor] = useState('');
    const [ram, setRam] = useState('');
    const [modelProductId, setModelProductId] = useState('');
    const [mtm, setMtm] = useState('');
    const [chargerId, setChargerId] = useState('');
    const [lapPassword, setLapPassword] = useState('');
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState(true);
    const [backPack, setBackpack] = useState('');
    const [mailId, setMailId] = useState('');
    const [powercableId, setPowercableId] = useState('');
    const [amount, setAmount] = useState('')
    
    useEffect(() => {
        LaptopData()
    }, []);
    const LaptopData = ()=>{
        axios.get(`${global.API_URL}/smg/laptop/getLaptop/${params.id}`,{
          headers: {
            
              'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
          }
         }).then((res)=>{
          console.log('Get data', res.data)
          setLaptoptype(res.data.laptopType)
          setSrNo(res.data.srNo);
          setCompany(res.data.company)  
          setModel(res.data.model);
          setProcessor(res.data.processor);
          setRam(res.data.ram);
          setModelProductId(res.data.modelProductId);
          setMtm(res.data.mtm);
          setChargerId(res.data.chargerId);
          setLapPassword(res.data.lapPassword);
          setComment(res.data.comment);
          setAmount(res.data.amountRent)
         }).catch((error)=>{
          console.log("error while fetching data", error)
         }) 
      }

      const UpdateLap =(e)=>{
        e.preventDefault();
        axios.put(`${global.API_URL}/smg/laptop/updateLaptopDetails/`,{
            chargerId: `${chargerId}`,
            id:`${params.id}`,
            company: `${company}`,
            lapPassword: `${lapPassword}`,
            laptopType: `${laptoptype}`, 
            model: `${model}`,
            modelProductId:`${modelProductId}`,
            mtm: `${mtm}`,
            processor:`${processor}`,
            srNo: `${srNo}`,
            comment:`${comment}`,
            status:`${status}`,
            ram:`${ram}`,
            amountRent:`${amount}`,
            backPack,
            mailId,
           powercableId
     },{
            headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res)=>{
            console.log("Updated", res.data)
            toast.success("Laptop Updated")
            navigate("/profilepage/laptopadd")
        }).catch((e)=>{
            console.log("Error", e)
        })
      }
     
      const Cancleadd = ()=>{
        navigate("/profilepage/laptopadd")
      }
    

  return (
    <div>
       <div>
        <h5>Edit Laptop</h5>
        <form onSubmit={UpdateLap}>
        <div className='container mainWrapper'>
            <div className='innerone'>
            <label>Laptop Type</label>
            <select className='form-select w-75' name='laptoptype' value={laptoptype} onChange={(e)=> setLaptoptype(e.target.value)}>
            <option></option>
             <option>Internal</option>
             <option>Rental</option>
            </select>
            <label>Serial No</label>
            <input type='text'  name='srNo' value={srNo} onChange={(e)=> setSrNo(e.target.value)} className='form-control w-75' />
            <label>Company</label>
            <input type='text'  name='company' value={company} onChange={(e)=> setCompany(e.target.value)} className='form-control w-75' />
              </div>
              <div className='innerone'>
              <label>Model</label>
            <input type='text'  name='model' value={model} onChange={(e)=> setModel(e.target.value)} className='form-control w-75' placeholder='Enter model '/>
            <label>Processor</label>
            <input type='text'  name='processor' value={processor} onChange={(e)=> setProcessor(e.target.value)} className='form-control w-75'/>
            <label>RAM</label>
            <input type='text'  name='ram' value={ram} onChange={(e)=> setRam(e.target.value)} className='form-control w-75' placeholder='Enter ram '/>
           </div>
           <div className='innerone'> 
            <label>Device ID</label>
            <input type='text'  name='modelProductId' value={modelProductId} onChange={(e)=> setModelProductId(e.target.value)} className='form-control w-75'/>
          
            <label>MTM No</label>
            <input type='text'  name='mtm' value={mtm} onChange={(e)=> setMtm(e.target.value)} className='form-control w-75' placeholder='Enter mtm no '/>
            <label>ChargerId</label>
            <input type='text'  name='chargerId' value={chargerId} onChange={(e)=> setChargerId(e.target.value)} className='form-control w-75' />
           </div>
           <div className='innerone'>
            <label>Password</label>
            <input type='text'  name='lapPassword' value={lapPassword} onChange={(e)=> setLapPassword(e.target.value)} className='form-control w-75'  />
            <label>Amount</label>
            <input type='text' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='form-control w-75'  />
            <label>Comments</label>
            <input type='text'  name='comment' value={comment} onChange={(e)=> setComment(e.target.value)} className='form-control w-75'/>
            <button className='btn btn-outline-success mt-4 me-5' type='submit' >Update</button>
            <button className='btn btn-outline-danger mt-4' type='submit' onClick={Cancleadd} >Cancel</button>
              </div>
              </div>
        </form>
      </div>
    </div>
  );
}

export default AddlaptopEdit;

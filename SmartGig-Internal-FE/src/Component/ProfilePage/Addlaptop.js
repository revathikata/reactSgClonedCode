import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import "../API/api"
import * as XLSX from 'xlsx';
import './Profile.css'
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination from './Pagination/Pagination';


let PageSize = 15

const Addlaptop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [importfile, setImportFile] = useState(null)
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
  const [error, setError] = useState(false)
  const [amount, setAmount] = useState('')
  const [laptopData, setLaptopData] = useState([]);
  const [searchNo, setSearchNo] = useState('')
  const [filterdata, setFilterData] = useState([])
  const [type, setType] = useState('')
  const [sortOrder, setSortOrder]= useState('asc');
  const [stock, setStock]= useState('')
  const heading = ['Sr.No','Model', 'Processor', 'DeviceId', 'ChargerId', 'Amount', 'Comments', 'AssignedTo']

  const currentTableData = useMemo(() => {

    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return laptopData.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, laptopData]);


  const sorting = (col)=>{
    if(sortOrder === 'asc'){
      const sorted = [...laptopData].sort((a, b)=>
      a[col].toLowerCase() > b[col].toLowerCase()? 1 : -1
      );
      setLaptopData(sorted);
      setSortOrder("dsc")
    }
    if(sortOrder === 'dsc'){
      const sorted = [...laptopData].sort((a, b)=>
      a[col].toLowerCase() < b[col].toLowerCase()? 1 : -1
      );
      setLaptopData(sorted);
      setSortOrder("asc")
    }
  }

  
  const LaptopData = () => {
    axios.get(`${global.API_URL}/smg/laptop/getAllLaptop/${status}`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      console.log(response.data)
      setLaptopData(response.data)
      setFilterData(response.data)
    }).catch((error) => {
      console.log("error while fetching data", error)
    })
  }

  useEffect(() => {
    LaptopData()

  }, []);


  const addLaptop = (e) => {
    e.preventDefault();
    if (!srNo) {
      setError(true);
      return false;
    }
    axios.post(`${global.API_URL}/smg/laptop/save`, {

      chargerId: `${chargerId}`,
      company: `${company}`,
      lapPassword: `${lapPassword}`,
      laptopType: `${laptoptype}`,
      model: `${model}`,
      modelProductId: `${modelProductId}`,
      mtm: `${mtm}`,
      processor: `${processor}`,
      srNo: `${srNo}`,
      comment: `${comment}`,
      status: `${status}`,
      ram: `${ram}`,
      amountRent:`${amount}`,
      backPack,
      mailId,
      powercableId
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      const data = res
      setLaptopData(laptoplist => [...laptoplist, data])
      toast.success("Laptop Added")
      LaptopData();
      setLaptoptype('')
      setSrNo('');
      setCompany('')
      setModel('');
      setProcessor('');
      setRam('');
      setModelProductId('');
      setMtm('');
      setChargerId('');
      setLapPassword('');
      setComment('');
      setAmount('');
    }).catch((e) => {
      console.log("Error", e)
    })
  }

  const CancelAdd = () => {
    setLaptoptype('')
    setSrNo('');
    setCompany('')
    setModel('');
    setProcessor('');
    setRam('');
    setModelProductId('');
    setMtm('');
    setChargerId('');
    setLapPassword('');
    setComment('');
    setAmount('');
  }

  const exportSheet = () => {
    const filteredData = laptopData.map(item => {
      const {lapPassword, ...rest} = item;
      return rest;
    });
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, "LaptopData");
    XLSX.writeFile(wb, "LaptopData.xlsx");
  }

  const searchName = (e) => {
    const getSearch = e.target.value;
    if (getSearch.length > 0) { 
      const searchData = laptopData.filter((laptop) => 
        laptop.srNo.toLowerCase().includes(getSearch)
      )
      setLaptopData(searchData);
    }  else{
      setLaptopData(filterdata);
    }
    
    setSearchNo(getSearch);
  };   


  const searchType = (e) => {
    const getType = e.target.value;
    if (getType.length > 0) { 
      const searchData = laptopData.filter((laptop) =>
        laptop.laptopType.toLowerCase().includes(getType)
      )
      setLaptopData(searchData);
    }  else{
      setLaptopData(filterdata);
    }
    
    setType(getType);
  };    

  

  const findStatus = (status) => {
    axios.get(`${global.API_URL}/smg/laptop/getAllLaptop/${status}`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      console.log(response.data)
      setLaptopData(response.data)
      setFilterData(response.data)
      setStock('')
    }).catch((error) => {
      console.log("error while fetching data", error)
    })
  }

  const onDeleteLaptop = (id) => {
    axios.put(`${global.API_URL}/smg/laptop/changeStatus/${id}`, {},
      {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((res) => {
        toast.success("Deleted successfully")
        LaptopData()
      }).catch((error) => {
        console.log("Error occured", error)
      })
  }

  const CheckStock = () => {
    axios.get(`${global.API_URL}/smg/laptop/laptopStock`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      console.log('Stock', res.data)
      setLaptopData(res.data)
    }).catch((error) => {
      console.log("Got Error", error)
    })
  }

  const AssignedLaptop=()=>{
    axios.get(`${global.API_URL}/smg/laptop/getAssignedLaptop`, {
      headers: {

        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      console.log("aasign", response.data)
      setLaptopData(response.data)

    }).catch((error) => {
      console.log("error while fetching data", error)
    })
  }

  const handleimport = (e) => {
    console.log(e.target.files)
    setImportFile(e.target.files[0]);
  }


  const importFile = (e) => {
    e.preventDefault();
    const excelFile = new FormData();
    excelFile.append('excel', importfile)

    axios.post(`${global.API_URL}/smg/laptop/laptopBulkUpload`, excelFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      console.log("already present", res.data)
      toast.success("Uploaded successfully")
      setImportFile('');
      LaptopData()
    })
      .catch((error) => {
        console.log("error occured", error);
      })
  }

  return (
    <div>
      <div>
        <div className='d-flex'>
          <h5>Add Laptop</h5>
          <input type='file' onChange={handleimport} className='form-control w-25 me-5 ms-5' title='Upload in bulk' />
          <button className='btn btn-outline-success' type='submit' onClick={importFile}>Import Excel</button>
        </div>

        <form onSubmit={addLaptop}>
          <div className='container mainWrapper'>
            <div className='innerone'>
              <label>Laptop Type</label>
              <select className='form-select w-75' name='laptoptype' value={laptoptype} onChange={(e) => setLaptoptype(e.target.value)}>
                <option></option>
                <option>Internal</option>
                <option>Rental</option>
                <option>Personal</option>
              </select>
              <label>Serial No<sup>*</sup></label>
              <input type='text' name='srNo' value={srNo} onChange={(e) => setSrNo(e.target.value)} className='form-control w-75' placeholder='Enter Laptop serial no' />
              {error && !srNo && <p className='errormsg'>Please Enter serial no</p>}
              <label>Company</label>
              <input type='text' name='company' value={company} onChange={(e) => setCompany(e.target.value)} className='form-control w-75' placeholder='Enter Company name' />
            </div>
            <div className='innerone'>
              <label>Model</label>
              <input type='text' name='model' value={model} onChange={(e) => setModel(e.target.value)} className='form-control w-75' placeholder='Enter model ' />
              <label>Processor</label>
              <input type='text' name='processor' value={processor} onChange={(e) => setProcessor(e.target.value)} className='form-control w-75' placeholder='Enter processor ' />
              <label>RAM</label>
              <input type='text' name='ram' value={ram} onChange={(e) => setRam(e.target.value)} className='form-control w-75' placeholder='Enter ram ' />
            </div>
            <div className='innerone'>
              <label>Device ID</label>
              <input type='text' name='modelProductId' value={modelProductId} onChange={(e) => setModelProductId(e.target.value)} className='form-control w-75' placeholder='Enter device id ' />

              <label>MTM No</label>
              <input type='text' name='mtm' value={mtm} onChange={(e) => setMtm(e.target.value)} className='form-control w-75' placeholder='Enter mtm no ' />
              <label>ChargerId</label>
              <input type='text' name='chargerId' value={chargerId} onChange={(e) => setChargerId(e.target.value)} className='form-control w-75' placeholder='Enter chargerid' />
            </div>
            <div className='innerone'>
              <label>Password</label>
              <input type='text' name='lapPassword' value={lapPassword} onChange={(e) => setLapPassword(e.target.value)} className='form-control w-75' placeholder='Enter chargerid' />
              <label>Amount</label>
              <input type='text' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='form-control w-75' placeholder='Billing amount for rental laptops ' />
              <label>Comments</label>
              <input type='text' name='comment' value={comment} onChange={(e) => setComment(e.target.value)} className='form-control w-75' placeholder='Enter comments ' />
              
              <button className='btn btn-outline-success mt-4 me-5 ' type='submit' >Add laptop</button>
              <button className='btn btn-outline-danger mt-4' onClick={CancelAdd} >Cancel</button>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <div className='d-flex justify-content-between'>
        <h5>Laptop Details</h5>
        <input
          className="form-control w-25"
          placeholder="Search By Serial No"
          name="searchNo"
          value={searchNo}
          onChange={searchName}
        />
       <input
          className="form-control w-25"
          placeholder="Search By Laptop Type"
          name="type"
          value={type}
          onChange={searchType}
        />
        <div>
          <select className='form-select' onChange={(e) => findStatus(e.target.value)}>
            <option value='true'>Working</option>
            <option value='false'>Inactive(Not in use)</option>
          </select>
        </div>
        <div>
          <select className='form-select' value={stock} name='stock' onChange={(e) => setStock(e.target.value)}>
            <option></option>
          <option onClick={CheckStock}>Stock</option>
            <option onClick={AssignedLaptop}>Assigned Laptop</option>
          </select>
        </div>
        <button className="btn btn-outline-dark btn-sm" onClick={exportSheet}>
          Export Sheet
        </button>
      </div>
      <div className='Border table-responsive mt-4 mb-3'>
        <table className="table table-sm table-hover mb-0 tablecontent">
          <thead>
            <tr className='laptopheadings'>
              <th onClick={() => sorting('laptopType')}><span className='me-2'>Type</span> <span className="bi bi-arrow-down-up"></span>
              </th>
              <th onClick={() => sorting('company')}><span className='me-2'>Brand</span> <span className="bi bi-arrow-down-up"></span>
              </th>
              <th onClick={() => sorting('ram')}><span className='me-2'>RAM</span> <span className="bi bi-arrow-down-up"></span>
              </th>
              {
                heading.map((data, index) => (

                  <th key={index}>{data}</th>

                ))
              }
            </tr>
          </thead>
          <tbody >
            {
              currentTableData.map((data, index) => {
                return <tr key={index}  >
                  <td>{data.laptopType}</td>
                  <td>{data.company}</td>
                  <td>{data.ram}</td>
                  <td>{data.srNo}</td>
                  <td>{data.model.substring(0, 8)}</td>
                  <td>{data.processor}</td>
                  <Tooltip title={data.modelProductId}>
                    <td >
                      {data.modelProductId.substring(0, 20)}
                    </td>
                  </Tooltip>
                  <Tooltip title={data.chargerId}>
                    <td >
                      {data.chargerId.substring(0, 20)}
                    </td>
                  </Tooltip>
                  <td>{data.amountRent}</td>
                  <td>{data.comment}</td>
                  <td>{data.empName}</td>
                  <Tooltip title='Edit'><td ><Link to={"/profilepage/addlaptopedit/" + data.id} className='bi bi-pen-fill' style={{ cursor: 'pointer', color: 'black' }}></Link></td></Tooltip>
                  <Tooltip title='Delete'>
                    <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteLaptop(data.id)}></td>
                  </Tooltip>
                </tr>
              })
            }
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={laptopData.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={laptopData}
        />
      </div>
    </div>
  );
}


export default Addlaptop;

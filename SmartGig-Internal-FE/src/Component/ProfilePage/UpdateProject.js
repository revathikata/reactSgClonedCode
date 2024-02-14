import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import "../API/api"
import { toast } from 'react-toastify';
import moment from 'moment';


const UpdateProject = (props) => {
  const [clientName, setClientName] = useState('');
  const [optionList, setOptionList] = useState([]);
  const [id, setId] = useState(null)
  const [projectName, setprojectName] = useState('');
  const [Pdetails, setPdetails] = useState('')
  const [status, setprojectStatus] = useState('')
  const [clientemail, setClientemail] = useState('')
  const [managername, setManagername] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const navigate = useNavigate();

  const handleProjectStatus = (e) => {
    setprojectStatus(e.target.value)
  }

  const handleUpdate = (e) => {
    if (status == "Completed") {
      axios.get(`${global.API_URL}/smg/project/getNoOffActiveEmp/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
          }
        }).then((res) => {
          if (window.confirm(`This project have ${res.data.NoOfActiveEmp} active employees. Do you want to update this project status as Completed`)) {
            // console.log("confirm");
            e.preventDefault();
            axios.put(`${global.API_URL}/smg/project/editProjectDetails/${id}`, {
              projectName: projectName,
              projectDescription: Pdetails,
              clientName: clientName,
              reportingManager: managername,
              clientEmail: clientemail,
              status: status,
              startDate: startDate,
              endDate: endDate
            }, {
              headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
              }
            })
              .then((res) => {
                // eslint-disable-next-line
                if (res.data.message == "details is updated successfully") {
                  navigate("/profilepage/projectform")
                  toast.success("project details updated successfully")
                }
                else if (res.data.message == "already present") {
                  toast.warning("project already present")
                }

              })
              .catch((err) => {
                console.log("error found", err);
              })
          }
          else { }
        }
        )
        .catch((err) => {
          console.log(err);
        })
    }

    else {
      e.preventDefault();
      axios.put(`${global.API_URL}/smg/project/editProjectDetails/${id}`, {
        projectName: projectName,
        projectDescription: Pdetails,
        clientName: clientName,
        reportingManager: managername,
        clientEmail: clientemail,
        status: status,
        startDate: startDate,
        endDate: endDate
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          // eslint-disable-next-line
          if (res.data.message == "details is updated successfully") {
            navigate("/profilepage/projectform")
            toast.success("project details updated successfully")
          }

        })
        .catch((err) => {
          console.log("error found", err);
        })
    }
  }

  useEffect(() => {
    setId(localStorage.getItem('Id'));
    setprojectName(localStorage.getItem('P_Name'));
    setPdetails(localStorage.getItem('P_Des'));
    setprojectStatus(localStorage.getItem('Status'));
    setClientName(localStorage.getItem('Client_Name'));
    setClientemail(localStorage.getItem("Client_Email"));
    setManagername(localStorage.getItem("Project_Manager"));
    setStartDate((localStorage.getItem("Start_Date") == "null") ? (localStorage.getItem("Start_Date")) : (moment(localStorage.getItem("Start_Date")).format("YYYY-MM-DD")));
    setEndDate((localStorage.getItem("End_Date") == "null") ? (localStorage.getItem("End_Date")) : (moment(localStorage.getItem("End_Date")).format("YYYY-MM-DD")));

    GetClientDetails();
  }, [])


  const GetClientDetails = () => {
    axios.get(`${global.API_URL}/smg/client/getAllClientDetails`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      // console.log("ListData fetched", res.data);
      setOptionList(res.data)
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  const hanldeClear = () => {
    navigate("/profilepage/projectform")
  }


  return (
    <>
      <div>
        {/* <form > */}
        <h5>Update Project</h5>
        <div className='container mainWrapper'>
          <div className='innerone'>
            <div>
              <label className='form-label'>Project Name </label>
              <input type="text" value={projectName} name="projectName" onChange={(e) => setprojectName(e.target.value)} className='form-control w-75' placeholder='Enter Project name' />
            </div>
            <div>
              <label className='form-label'>Project Details</label>
              <input type="text" value={Pdetails} name="Pdetails" onChange={(e) => setPdetails(e.target.value)} className='form-control w-75' placeholder='Enter Project details' />
            </div>
            <div>
              <label className='form-label'>Project Manager <sup>*</sup></label>
              <input type="text" required value={managername} name="managername" onChange={(e) => setManagername(e.target.value)} className='form-control w-75' placeholder='Enter manager name' />
            </div>

          </div>

          <div className='innerone'>

            <div >
              <label className='form-label'>Project Status </label>
              <select value={status} name="status" className='form-select w-75' onChange={handleProjectStatus}>
                <option>select</option>
                <option>
                  InProgress
                </option>
                <option>
                  Completed
                </option>
                <option>
                  Pending
                </option>
              </select>
            </div>
            <div >
              <label>Select Client</label>
              <select className='form-select w-75' value={clientName} onChange={(e) => setClientName(e.target.value)}>
                <option>select</option>
                {
                  optionList.map((list) => {
                    return <option key={list.clientId} value={list.clientName}>{list.clientName}</option>
                  })
                }
              </select>
            </div>
            <div>
              <label className='form-label'>Client E-mail <sup>*</sup></label>
              <input type="text" required value={clientemail} name="clientemail" onChange={(e) => setClientemail(e.target.value)} className='form-control w-75' placeholder='Enter client email' />
            </div>
          </div>

          <div className='innerone'>
            <div>
              <label>Start Date</label>
              <input type='date' className='form-control w-75' value={startDate} name='startDate' onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>End Date</label>
              <input type='date' className='form-control w-75' value={endDate} name='endDate' onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button type='submit' className='btn btn-success me-2 Btn' onClick={handleUpdate}>Update Project</button>
            <button type='button' className='btn btn-outline-danger Btn' onClick={hanldeClear}> Cancel </button>
          </div>
        </div>
        {/* </form > */}
      </div >
    </>
  );
}

export default UpdateProject;
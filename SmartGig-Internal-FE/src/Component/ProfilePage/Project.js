import axios from 'axios';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import "../API/api"
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import moment from 'moment';
import Pagination from './Pagination/Pagination';
import * as XLSX from 'xlsx';

let PageSize = 15

const initialdataProject = {
  projectName: "",
  projectDescription: "",
  status: "",
  client: '',
  clientemail: '',
  managername: '',
  startDate: '',
  endDate: ''
}

const ProjectForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const refElement = useRef("");
  const [optionList, setOptionList] = useState([]);
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [data, setData] = useState(initialdataProject);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false)
  const heading = ['Project Name', 'Project Manager', 'Project Description', "ClientName", 'Client_Email', 'Start_Date', 'End_Date', "Status"]

  const [projectData, setProjectData] = useState([]);
  const [projectState, setProjectState] = useState('');
  const [clientState, setClientState] = useState('');

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return values.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, values]);

  const {
    projectName,
    projectDescription,
    status,
    client,
    clientemail,
    managername,
    startDate,
    endDate
  } = data;

  const inputHandle = (e) => {

    setData({
      ...data,
      [e.target.name]: [e.target.value]
    })
  }

  const handleProjects = (e) => {
    e.preventDefault();
    if (!status || !client) {
      setError(true);
      return false;
    }
    axios.post(`${global.API_URL}/smg/project/saveProjectDetails`, {
      projectName: `${projectName}`,
      projectDescription: `${projectDescription}`,
      clientName: `${client}`,
      reportingManager: `${managername}`,
      clientEmail: `${clientemail}`,
      status: `${status}`,
      startDate: `${startDate}`,
      endDate: `${endDate}`
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        console.log("details saved into the database", res.data);
        // eslint-disable-next-line
        if (res.data.message == "details was saved into the database.......") {
          setValues(laptoplist => [...laptoplist, res.data])
          toast.success("Project details saved successfully")
          GetProjectDetails()
          setData(initialdataProject)
        }
        else if (res.data.message == "already present") {
          toast.warning("Project Already Present")
        }

      })
      .catch((err) => {
        console.log("error found", err);
      })
  }

  const GetProjectDetails = () => {
    axios.get(`${global.API_URL}/smg/project/getAllProjectDetails`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      console.log("Fetch successfully", res.data);
      setValues(res.data);
      setProjectData(res.data);
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  const GetClientDetails = () => {
    axios.get(`${global.API_URL}/smg/client/getAllClientDetails`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      setOptionList(res.data)
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  useEffect(() => {
    GetProjectDetails();
    GetClientDetails();
  }, [])

  const editProject = (projectId, projectName, projectDes, projectStatus, ClientName, reportingManager, clientEmail, startDate, endDate) => {
    localStorage.setItem("Id", projectId);
    localStorage.setItem("P_Name", projectName);
    localStorage.setItem("P_Des", projectDes);
    localStorage.setItem("Status", projectStatus);
    localStorage.setItem("Client_Name", ClientName);
    localStorage.setItem("Project_Manager", reportingManager);
    localStorage.setItem("Client_Email", clientEmail);
    localStorage.setItem("Start_Date", startDate)
    localStorage.setItem("End_Date", endDate)

    navigate('/profilepage/updateproject');
  }

  const openFilter = () => {
    setVisible(!visible);
  }

  const handleCancel = () => {
    setData(initialdataProject)
    GetProjectDetails()
    setVisible(false)
  }

  const onDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios.post(`${global.API_URL}/smg/project/deleteprojectdetails/${projectId}`, {}, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then(() => {
          GetProjectDetails();
        })
        .catch((err) => {
        })
    }

  }

  const searchProject = (e) => {
    const getproject = e.target.value;
    if (getproject.length > 0) {
      const searchData = projectData.filter((data) =>
        data.projectName.toLowerCase().includes(getproject)
      )
      setValues(searchData);
    } else {
      setValues(projectData);
    }

    setProjectState(getproject);
  };

  const searchClient = (e) => {
    const getclient = e.target.value;
    if (getclient.length > 0) {
      const searchData = projectData.filter((data) =>
        data.ClientName.toLowerCase().includes(getclient)
      )
      setValues(searchData);
    }
    else {
      setValues(projectData);
    }

    setClientState(getclient);
  };

  const exportSheet = () => {
    const filteredData = values.map(item => {
      return item;
    });
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, "ProjectData");
    XLSX.writeFile(wb, "ProjectData.xlsx");
  }


  return (
    <div >
      <div >
        <form onSubmit={handleProjects}>
          <h5>Add Project</h5>
          <hr />
          <div className='container mainWrapper'>
            <div className='innerone'>
              <div>
                <label className='form-label'>Project Name <sup>*</sup></label>
                <input type="text" ref={refElement} required value={projectName} name="projectName" onChange={inputHandle} className='form-control w-75' placeholder='Enter Project name' />
              </div>
              <div>
                <label className='form-label'>Project Details <sup>*</sup></label>
                <input type="text" ref={refElement} required value={projectDescription} name="projectDescription" onChange={inputHandle} className='form-control w-75' placeholder='Enter Project details' />
              </div>
              <div>
                <label className='form-label'>Project Manager <sup>*</sup></label>
                <input type="text" ref={refElement} required value={managername} name="managername" onChange={inputHandle} className='form-control w-75' placeholder='Enter manager name' />
              </div>

            </div>
            <div className='innerone'>
              <label className='form-label'>Project Status <sup>*</sup></label>
              <select value={status} name="status" className='form-select w-75' onChange={inputHandle}>
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
              {error && !status && <p className='errormsg'>Please Select Status</p>}

              <label>Select Client</label>
              <select className='form-select w-75' value={client} name="client" onChange={inputHandle}>
                <option>Select</option>
                {
                  optionList.map((list) => {
                    return <option key={list.clientId} >{list.clientName}</option>
                  })
                }
              </select>
              {error && !client && <p className='errormsg'>Please Select Client</p>}

              <div>
                <label className='form-label'>Client E-mail <sup>*</sup></label>
                <input type="text" ref={refElement} required value={clientemail} name="clientemail" onChange={inputHandle} className='form-control w-75' placeholder='Enter client email' />
              </div>

            </div>
            <div className='innerone'>

              <div>
                <label>Start Date</label>
                <input type='date' className='form-control w-75' value={startDate} name='startDate' onChange={inputHandle} />
              </div>
              <div>
                <label>End Date</label>
                <input type='date' className='form-control w-75' value={endDate} name='endDate' onChange={inputHandle} />
              </div>

              <button type='submit' className='btn btn-success  Btn'>Add Project</button>

            </div>

          </div>
        </form >
      </div >
      <hr />

      <h5 style={{ marginTop: "20px" }}>Project Details</h5>

      <div className='d-flex justify-content-between'>
        <input
          className="form-control w-25"
          placeholder="Search By Client Name"
          name="clientState"
          value={clientState}
          onChange={searchClient}
        />
        <input
          className="form-control w-25"
          placeholder="Search By Project Name"
          name="projectState"
          value={projectState}
          onChange={searchProject}
        />

        <button className="btn btn-outline-dark btn-sm" onClick={exportSheet}>
          Export Sheet
        </button>
      </div>
      <br />

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
          <tbody className='TBody'>
            {
              currentTableData.map((value, index) => {
                return <tr key={index}  >
                  <td style={{ color: '#2562AB', cursor: 'pointer' }} >{value.projectName}</td>
                  <td>{value.reportingManager}</td>
                  <td >{value.projectDes}</td>
                  <td >{value.ClientName}</td>
                  <td>{value.clientEmail}</td>
                  <td>{moment(value.startDate).format("MMM Do, YYYY")}</td>
                  <td>{moment(value.endDate).format('MMM Do, YYYY')} </td>
                  <td >{value.projectStatus}</td>

                  <Tooltip title='Edit'>
                    <td className='bi bi-pen-fill' style={{ cursor: 'pointer' }} onClick={() => editProject(value.projectId, value.projectName, value.projectDes, value.projectStatus, value.ClientName, value.reportingManager, value.clientEmail, value.startDate, value.endDate)}></td>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteProject(value.projectId)}></td>
                  </Tooltip>
                </tr>
              })
            }
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={values.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={values}
        />
      </div>
    </div>
  );
}

export default ProjectForm;

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Profile.css'
import "../API/api"
import moment from "moment";
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import Pagination from './Pagination/Pagination';

let PageSize = 15

const initialdata = {
  fullName: "",
  projectName: '',
}
const initialDate = {
  onboarddate: "",
  enddate: ""
}

const filterdata = {
  nameofEmp: '',
  role: '',
  clientName: '',
  projectData: '',
  status: true
}

const AssignProject = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [assignproject, setAssignproject] = useState(initialdata)
  const [assignproject1, setAssignproject1] = useState(initialDate)
  const [visible, setVisible] = useState(false)
  const [project, setProject] = useState([]);
  const [techemployee, setTechemployee] = useState([]);
  const [assigndata, setAssigndata] = useState([]);
  const [error, setError] = useState(false)
  const [roles, setRoles] = useState([])
  const [optionList, setOptionList] = React.useState([]);
  const [filter, setFilter] = useState(filterdata)
  const [joiningDtBkend, setJoiningDtBkend] = useState();
  const [lastWorkingDtBkend, setLastWorkingDtBkend] = useState();
  const heading = ['Employee Name', 'Project Name', 'Client Name', 'Role', 'Start-Date', 'End-Date', 'Status'];
  const { nameofEmp, role, clientName, status, projectData } = filter
  const { fullName, projectName } = assignproject;
  const { onboarddate, enddate } = assignproject1;

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return assigndata.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, assigndata]);

  const oninputChange = (e) => {
    setAssignproject({
      ...assignproject,
      [e.target.name]: [e.target.value]
    })
  }

  const oninputChangeStartDt = (e) => {
    setAssignproject1({
      ...assignproject1,
      [e.target.name]: [e.target.value]
    })

    if ((Math.abs(new Date(document.getElementById("firstdate").value))) < (Math.abs(new Date(joiningDtBkend)))) {
      window.confirm(`From Date should be after Joining Date (${moment(joiningDtBkend).format("Do MMM, YYYY")})`)
      { (setAssignproject1(initialDate)) }
    }

    if (lastWorkingDtBkend) {
      if ((Math.abs(new Date(new Date(document.getElementById("firstdate").value)))) > (Math.abs(new Date(lastWorkingDtBkend)))) {
        window.confirm(` From Date should be less than Last Working Date(${moment(lastWorkingDtBkend).format("Do MMM, YYYY")})`)
        { (setAssignproject1(initialDate)) }
      }
    }

  }

  const oninputChangeEndDt = (e) => {
    setAssignproject1({
      ...assignproject1,
      [e.target.name]: [e.target.value]
    })

    if (lastWorkingDtBkend) {
      console.log("lwt", Math.abs((moment(Math.abs(new Date(lastWorkingDtBkend))).add(1, "days"))._d));
      console.log("secnd Dt", (Math.abs(new Date(document.getElementById("seconddate").value))));
      if ((Math.abs(new Date(document.getElementById("seconddate").value))) > (Math.abs((moment(Math.abs(new Date(lastWorkingDtBkend))).add(1, "days"))._d))) {
        window.confirm(`To Date should be Before Last Working Date(${moment(lastWorkingDtBkend).format("Do MMM, YYYY")})`)
        { (setAssignproject1(initialDate)) }
      }
    }

    if ((Math.abs(new Date(new Date(document.getElementById("seconddate").value)))) < (Math.abs(new Date(joiningDtBkend)))) {
      window.confirm(` To Date should be greater than Joining Date(${moment(joiningDtBkend).format("Do MMM, YYYY")})`)
      { (setAssignproject1(initialDate)) }
    }

  }

  const FilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: [e.target.value]
    })
  }


  const assignProjectData = (e) => {
    e.preventDefault();
    if (!fullName || !projectName || !onboarddate) {
      setError(true);
      return false;
    }
    axios.post(`${global.API_URL}/smg/assignedProject/saveAssignedProject`, {
      employeeNameList: fullName,
      projectName: `${projectName}`,
      onBoardDate: `${onboarddate}`,
      offBoardDate: `${enddate}`
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      if (res.data.msg == "assigned") {
        toast.success("Project Assigned!")
        setAssignproject(initialdata)
        setAssigndata(assigndata => [...assigndata, res])
        GetAssignData();
      }
      else if (res.data.msg == "Already in this project") {
        toast.warning(`${fullName} is Already in this project!`)
      }
    }).catch((err) => {
      console.log("some error here", err);
    })
  }

  useEffect(() => {
    const GetProjectDetails = () => {
      axios.get(`${global.API_URL}/smg/project/getAllProjectDetails`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((res) => {
        const data = res.data
        // let result = data.filter(items => items.projectStatus !== "Completed")
        setProject(data);
      }).catch((err) => {
        console.log("some error", err);
      })
    }

    const GetEmpDetails = () => {
      axios.get(`${global.API_URL}/smg/employee/getTechEmp`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((res) => {
        const result = res.data
        setTechemployee(result)
      }).catch((err) => {
        console.log("some error", err);
      })
    }

    const allRoles = () => {
      axios.get(`${global.API_URL}/smg/candidate/getAllrole`, {
        headers: {

          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((response) => {
        setRoles(response.data)
      }).catch((error) => {
        console.log("error while fetching data", error)
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

    GetProjectDetails();
    GetEmpDetails();
    GetAssignData();
    allRoles();
    GetClientDetails();
  }, []);


  const GetAssignData = () => {
    axios.get(`${global.API_URL}/smg/assignedProject/getListOfAssignedProject`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      setAssigndata(res.data);
    }).catch((err) => {
      console.log("some error", err);
    })
  }


  const onDeleteAssign = (EmployeeProjectId) => {
    axios.post(`${global.API_URL}/smg/assignedProject/deleteEmployeeProject/${EmployeeProjectId}`, {}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then(() => {
        GetAssignData();
      })
      .catch((err) => {
      })
  }


  const handleCheckAlreadyAssigned = () => {
    axios.post(`${global.API_URL}/smg/assignedProject/checkIsAllReadyAssigned/${fullName}`, {},
      {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
      .then((res) => {
        console.log(res.data);
        setJoiningDtBkend(res.data.DOJ)
        setLastWorkingDtBkend(res.data.lastWorkingDate);
        if (res.data.msg == "He is already in project") {
          alert(`${fullName} is already in ${res.data.noOfProject} project! Do you want to continue`)
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
  }

  useEffect(() => {
    if (fullName) {
      handleCheckAlreadyAssigned();
    }
  }, [fullName])

  const searchData = (e) => {
    e.preventDefault();
    axios.post(`${global.API_URL}/smg/assignedProject/getEmployeeProjectFilter`, {
      fullName: `${nameofEmp}`,
      clientName: `${clientName}`,
      role: `${role}`,
      projectName: `${projectData}`,
      status: `${status}`
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        setAssigndata(res.data)

      })
      .catch((err) => {
        toast.warning("Data Not Found")
        console.log("err", err);
      })
  }

  const openFilter = () => {
    setVisible(!visible);
  }

  const handleCancel = () => {
    GetAssignData()
    setFilter(filterdata)
    setVisible(false)
  }

  // const hanldeChange =(value)=>{
  //   setFullName(Array.isArray(value)?value.map(x=>x.value):[])
  //  }

  return (
    <div >
      {visible ? "" : <button className='btn  bi bi-search me-3 searchButton' onClick={openFilter}></button>}

      {
        visible ? (
          <>
            <h5>Search Project</h5>
            <hr />
            <div className='d-flex justify-content-between mb-2'>
              <select name='nameofEmp' className='form-select w-25 me-2 ' value={nameofEmp} onChange={FilterChange}>
                <option> Select Employee</option>

                {
                  techemployee.map((lists, index) => {
                    return <option key={index}>{lists.fullName}</option>
                  })
                }

              </select>

              <select className='form-select w-25 me-2' placeholder='Enter Employee Name' name='role' value={role} onChange={FilterChange} >
                <option value="" disabled selected>Select Role</option>
                {
                  roles.map((list, index) => {
                    return <option key={index}>{list}</option>
                  })
                }
              </select>

              <select className='form-select w-25 me-2' name='clientName' value={clientName} onChange={FilterChange} >
                <option value="" disabled selected>Select Client</option>
                {
                  optionList.map((list) => {
                    return <option key={list.clientId} >{list.clientName}</option>
                  })
                }
              </select>

              <select className='form-select w-25 me-2' name="projectData" value={projectData} onChange={FilterChange}>
                <option value="" disabled selected>Select Project</option>
                {
                  project.map((items) => {
                    return <option key={items.projectId}>{items.projectName}</option>
                  })
                }
              </select>
              <button type='submit' className='btn btn-outline-info bi bi-search w-25 me-2' onClick={searchData} > Search </button>
              <button type='button' className='btn btn-outline-warning' onClick={handleCancel}> cancel</button>
            </div>
          </>


        ) : (<form onSubmit={assignProjectData} >
          <h5>Assign Project</h5>
          <hr />
          <div className='formWrapper'>
            <div className='w-25'>
              <label className='form-label'>Employee Name <sup>*</sup></label>
              <select name='fullName' className='form-select' value={fullName} onChange={oninputChange}>
                <option></option>

                {
                  techemployee.map((lists) => {
                    return <option key={lists.employeeDetailsId} > {lists.fullName} </option>
                  })
                }

              </select>
              {/* <Select
                options={techemployee.map(e => ({ label: e.fullName, value:e.fullName}))}
                 name="fullName"
                 placeholder="Select Employee"
                 onChange={hanldeChange}
                 isSearchable={true}
                 isMulti
                /> */}
            </div>
            <div>
              <label className='form-label'>Project Name</label>
              <select className='form-select' name="projectName" value={projectName} onChange={oninputChange}>
                <option>Select</option>
                {
                  project.map((items) => {
                    return <option key={items.projectId}>{items.projectName}</option>
                  })
                }
              </select>
              {error && !projectName && <p className='errormsg'>Please Select Project</p>}
            </div>
            <div>
              <label className='form-label'>Start Date</label>
              <input type='date' id='firstdate' className='form-control' value={onboarddate} name="onboarddate" onChange={oninputChangeStartDt} />
              {error && !onboarddate && <p className='errormsg'>Enter date</p>}
            </div>
            <div>
              <label className='form-label'>End Date</label>
              <input type='date' id='seconddate' className='form-control' value={enddate} name="enddate" onChange={oninputChangeEndDt} />
              {error && !enddate && <p className='errormsg'>Enter date</p>}
            </div>
            <button type='submit' className='btn btn-success Btn mt-4'>Assign Project</button>
          </div>
        </form>
        )
      }

      <hr />

      <h5>Assigned Project</h5>

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
          <tbody >
            {
              currentTableData.map((data) => {
                return <tr key={data.EmployeeProjectId}  >
                  <td >{data.EmployeeName}</td>
                  <td >{data.projectName}</td>
                  <td >{data.clientName}</td>
                  <td >{data.role}</td>
                  <td >{moment(data.onBoardDate).format('MMM Do, YYYY')}</td>
                  <td >{moment(data.offBoardDate).format('MMM Do, YYYY')}</td>
                  <>{data.status ? <td style={{ color: "green" }}> Active </td> : <td style={{ color: "red" }}>Inactive</td>}</>
                 <Tooltip title='Delete'>
                  <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteAssign(data.EmployeeProjectId)} ></td>
                 </Tooltip> 
                </tr>
              })
            }
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={assigndata.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={assigndata}
        />
      </div>
    </div>
  );
}

export default AssignProject;

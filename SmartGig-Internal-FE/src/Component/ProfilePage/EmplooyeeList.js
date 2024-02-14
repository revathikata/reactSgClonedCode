import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@reach/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/dialog/styles.css';
import '@reach/tabs/styles.css';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import "../API/api"
import moment from 'moment';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Tooltip from '@mui/material/Tooltip';
import Pagination from './Pagination/Pagination';
import LaptopIcon from '@mui/icons-material/Laptop';
import { Link } from 'react-router-dom';
import _ from 'lodash';

let PageSize = 20

const EmplooyeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [successUp, setSuccessUp] = useState(false);
  const [imagepopup, setImagepopup] = useState(false);
  const [roles, setRoles] = useState([])
  const [employeeImg, setEmployeeImg] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [filterData, setFilterData] = useState([])
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState(true)
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false)
  const [hikeDetails, setHikeDetails] = useState([]);
  const [laptopData, setLaptopData] = useState([])
  const [sortOrder, setSortOrder]= useState('asc');
  

  useEffect(() => {
    GetEmployeeData()
    allRoles();

  }, []);

  const sorting = (col)=>{
    if(sortOrder === 'asc'){
      const sorted = [...data].sort((a, b)=>
      a[col].toLowerCase() > b[col].toLowerCase()? 1 : -1
      );
      setData(sorted);
      setSortOrder("dsc")
    }
    if(sortOrder === 'dsc'){
      const sorted = [...data].sort((a, b)=>
      a[col].toLowerCase() < b[col].toLowerCase()? 1 : -1
      );
      setData(sorted);
      setSortOrder("asc")
    }
  }

  const currentTableData = useMemo(() => {

    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, data]);


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

  const GetEmployeeData = () => {
    axios.get(`${global.API_URL}/smg/employee/getAllEmployeeList`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        console.log(res.data)
        setData(res.data)
        setFilterData(res.data)
      }).catch((error) => {
        console.log("error", error);
      })
  };


  const onDelete = (employeeDetailsId) => {
    axios.post(`${global.API_URL}/smg/employee/deleteEmployee/${employeeDetailsId}`, {}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then(() => {
        toast.warning("Deleted");
        GetEmployeeData();
      }).catch((err) => {
        console.log("error", err);
      })
  }

  const hanldeSearch = () => {

    axios.get(`${global.API_URL}/smg/employee/getemplyeeFilter?fullname=${name}&role=${role}&currentlocation=${location}&status=${status}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        console.log("fetch", res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err);
      })

  }

  const Edit = (data) => {
    let {
      employeeDetailsId,
      ctc,
      currentLocation,
      degination,
      role,
      dateOfBirth,
      dateOfJoining,
      dateOfMarriage,
      lastWorkingDay,
      email,
      empId,
      empType,
      fullName,
      gender,
      mobileNo,
      primaryLocation,
      primarySkills,
      qualification,
      secondrySkills,
      status,
      fixedCtc,
      variablePay,
      exp,
      hiredAs,
      uan,
      alternateNo
    } = data;

    window.localStorage.setItem("CTC", ctc);
    window.localStorage.setItem("CRNTLOCATION", currentLocation);
    window.localStorage.setItem("DEGINATION", degination);
    window.localStorage.setItem("ROLE", role);
    window.localStorage.setItem("DOB", dateOfBirth);
    window.localStorage.setItem("DOJ", dateOfJoining);
    window.localStorage.setItem("DOM", dateOfMarriage);
    window.localStorage.setItem("LWD", lastWorkingDay);
    window.localStorage.setItem("EMAIL", email);
    window.localStorage.setItem("EMP_ID", empId);
    window.localStorage.setItem("EMP_TYPE", empType);
    window.localStorage.setItem("FULLNAME", fullName);
    window.localStorage.setItem("GENDER", gender);
    window.localStorage.setItem("MOB_NO", mobileNo);
    window.localStorage.setItem("P_LOC", primaryLocation);
    window.localStorage.setItem("P_SKILLS", primarySkills);
    window.localStorage.setItem("QUALIFICATION", qualification);
    window.localStorage.setItem("S_SKILLS", secondrySkills);
    window.localStorage.setItem("STATUS", status);
    window.localStorage.setItem("EDIT_ID", employeeDetailsId);
    window.localStorage.setItem("FIXED_CTC", fixedCtc);
    window.localStorage.setItem("VARIABLE_PAY", variablePay);
    window.localStorage.setItem("EXPERIENCE", exp);
    window.localStorage.setItem("HIREDAS", hiredAs);
    window.localStorage.setItem("UAN", uan);
    window.localStorage.setItem("ALT_MOB", alternateNo);

    const GetEmployeeDocs = () => {
      axios.get(`${global.API_URL}/smg/employee/getImage/${employeeDetailsId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {

          let {
            documentationId,
            certificate10th,
            certificate12th,
            graduation,
            postGraduation,
            paySlip,
            offerLetter1,
            offerLetter2,
            offerLetter3,
            employeeImage,
            resume
          } = res.data;

          window.localStorage.setItem("EMPLOYEEIMAGE", employeeImage)
          window.localStorage.setItem("DOCUMENTATION_ID", documentationId)
          window.localStorage.setItem("CERTIFICATE10TH", certificate10th)
          window.localStorage.setItem("CERTIFICATE12TH", certificate12th)
          window.localStorage.setItem("GRADUATION", graduation)
          window.localStorage.setItem("POSTGRADUATION", postGraduation)
          window.localStorage.setItem("PAYSLIP", paySlip)
          window.localStorage.setItem("OFFERLETTER1", offerLetter1)
          window.localStorage.setItem("OFFERLETTER2", offerLetter2)
          window.localStorage.setItem("OFFERLETTER3", offerLetter3)
          window.localStorage.setItem("RESUME", resume)

          const GetLaptopDetails = () => {
            axios.get(`${global.API_URL}/smg/assignedLap/getAssignedLaptopsDetailsbyid/${employeeDetailsId}`, {
              headers: {
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
              }
            })
              .then((res) => {
                // console.log(res.data)

                let {
                  id,
                  laptopId,
                  issueDate,
                  replaceDate,
                  returnDate,
                  srNo
                } = res.data

                window.localStorage.setItem("ID_FOR_LAPTOP", id)
                window.localStorage.setItem("LAPTOP_ID_FOR_LAPTOP", laptopId)
                window.localStorage.setItem("SERIAL_NO", srNo)
                window.localStorage.setItem("ISSUE_DATE", issueDate)
                window.localStorage.setItem("REPLACE_DATE", replaceDate)
                window.localStorage.setItem("RETURN_DATE", returnDate)

                navigate("/profilepage/editemployee");

              })
              .catch((error) => {
                console.log(error);
                navigate("/profilepage/editemployee");

              })
          };

          GetLaptopDetails();

        }).catch((error) => {
          console.log("error", error);
        })
    };


    GetEmployeeDocs();
    // GetLaptopDetails();

    // navigate("/profilepage/editemployee");

  }

const heading = ['Emp_Id', 'Email-Id', 'DOJ', 'Designation', 'Role', 'Work Location', 'Phone No', 'Billing', 'CTC'];
  const headingforPopup = ["Effective Date", "Hike_Amt", "Variable_Amt"]
  const headingforLaptop = ["Date of Issue", "Serial No", 'Return Date', 'Replace Date', 'Return Status']

  const handleSuccessUp = (data) => {
    let {
      employeeDetailsId,
      ctc,
      currentLocation,
      degination,
      dateOfBirth,
      dateOfJoining,
      dateOfMarriage,
      lastWorkingDay,
      email,
      empId,
      empType,
      fullName,
      gender,
      mobileNo,
      primaryLocation,
      primarySkills,
      qualification,
      secondrySkills,
      status,
      fixedCtc,
      variablePay,
      exp,
      hiredAs,
      uan,
      alternateNo
    } = data;

    window.localStorage.setItem("CTC", ctc);
    window.localStorage.setItem("CRNTLOCATION", currentLocation);
    window.localStorage.setItem("DEGINATION", degination);
    window.localStorage.setItem("DOB", dateOfBirth);
    window.localStorage.setItem("DOJ", dateOfJoining);
    window.localStorage.setItem("DOM", dateOfMarriage);
    window.localStorage.setItem("LWD", lastWorkingDay);
    window.localStorage.setItem("EMAIL", email);
    window.localStorage.setItem("EMP_ID", empId);
    window.localStorage.setItem("EMP_TYPE", empType);
    window.localStorage.setItem("FULLNAME", fullName);
    window.localStorage.setItem("GENDER", gender);
    window.localStorage.setItem("MOB_NO", mobileNo);
    window.localStorage.setItem("P_LOC", primaryLocation);
    window.localStorage.setItem("P_SKILLS", primarySkills);
    window.localStorage.setItem("QUALIFICATION", qualification);
    window.localStorage.setItem("S_SKILLS", secondrySkills);
    window.localStorage.setItem("STATUS", status);
    window.localStorage.setItem("EDIT_ID", employeeDetailsId);
    window.localStorage.setItem("FIXED_CTC", fixedCtc);
    window.localStorage.setItem("VARIABLE_PAY", variablePay);
    window.localStorage.setItem("EXPERIENCE", exp);
    window.localStorage.setItem("HIREDAS", hiredAs);
    window.localStorage.setItem("UAN", uan);
    window.localStorage.setItem("ALT_MOB", alternateNo);


    const GetEmployeeDocs = () => {
      axios.get(`${global.API_URL}/smg/employee/getImage/${employeeDetailsId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          console.log(res.data)
          let {
            documentationId,
            certificate10th,
            certificate12th,
            graduation,
            postGraduation,
            paySlip,
            offerLetter1,
            offerLetter2,
            offerLetter3,
            employeeImage,
            resume
          } = res.data;

          window.localStorage.setItem("EMPLOYEEIMAGE", employeeImage)
          window.localStorage.setItem("DOCUMENTATION_ID", documentationId)
          window.localStorage.setItem("CERTIFICATE10TH", certificate10th)
          window.localStorage.setItem("CERTIFICATE12TH", certificate12th)
          window.localStorage.setItem("GRADUATION", graduation)
          window.localStorage.setItem("POSTGRADUATION", postGraduation)
          window.localStorage.setItem("PAYSLIP", paySlip)
          window.localStorage.setItem("OFFERLETTER1", offerLetter1)
          window.localStorage.setItem("OFFERLETTER2", offerLetter2)
          window.localStorage.setItem("OFFERLETTER3", offerLetter3)
          window.localStorage.setItem("RESUME", resume)
          setEmployeeImg(res.data.employeeImage)
          setSuccessUp(true);
        }).catch((error) => {
          console.log("error", error);
        })
    };

    const GetLaptopDetails = () => {
      axios.get(`${global.API_URL}/smg/assignedLap/getAssignedLaptopsDetails/${employeeDetailsId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          console.log(res.data)
          setLaptopData(res.data)
        })
        .catch((error) => {
          console.log(error);
        })
    };

    const GetHikeDetails = () => {
      axios.get(`${global.API_URL}/smg/employee/getHikeInfoByEmpId/${employeeDetailsId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
        .then((res) => {
          setHikeDetails(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
    };

    GetEmployeeDocs();
    GetLaptopDetails();
    GetHikeDetails();
  }

  const handleSuccessClose = () => {
    setSuccessUp(false);

  }
  const handleClose = () => {
    setImagepopup(false)
  }
  const zoomImage = () => {
    setImagepopup(true)
  }

  const openFilter = () => {
    setVisible(!visible);
  }

  const hanldeClear = () => {
    setRole("")
    setName("")
    setLocation("")
    setStatus("")
    GetEmployeeData()
    setVisible(false)
  }

  const columns = ['empId', 'fullName', 'role', 'gender', 'empType', 'degination', 'primarySkills', 'secondrySkills', 'primaryLocation', 'currentLocation', 'exp', 'email', 'qualification', 'dateOfJoining', 'uan', 'fixedCtc', 'variablePay', 'ctc', 'empBillingTotalAmount', 'hiredAs', 'dateOfMarriage', 'dateOfBirth', 'mobileNo', 'alternateNo', 'employeeDetailsId', 'status', 'lastWorkingDay',]

  const exportSheet = () => {
    const date = new Date()
    const dateString = moment(date).format('YYYY-MM-DD');
    const fileName = `SG_EmployeeData_Master_${dateString}.xlsx`;
    const reorderedData = data.map(row => _.pick(row, columns));
    //export code
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(reorderedData);
    XLSX.utils.book_append_sheet(wb, ws, "SG_EmployeeData_Master");
    XLSX.writeFile(wb, fileName);
  }

  const searchName = (e) => {
    const getSearch = e.target.value;

    if (getSearch.length > 0) {
      const searchData = data.filter((employee) =>
        employee.fullName.toLowerCase().includes(getSearch)
      );
      setData(searchData);
    } else {
      setData(filterData);
    }
    setName(getSearch);
  };

  const Laptop = (employeeDetailsId) => {
    window.localStorage.setItem("EDIT_ID", employeeDetailsId)
    navigate("/profilepage/assignlaptop");
  }

  return (
    <>
      {visible ? (
        ""
      ) : (
        <button
          className="btn bi bi-search me-3 searchButton"
          onClick={openFilter}
        ></button>
      )}

      <div className="d-flex mb-2">
        <button className="btn btn-success me-2" onClick={exportSheet}>
          Export Sheet
        </button>
      </div>

      {visible && (
        <div className="d-flex justify-content-around w-100 mb-2 mt-2">
          <input
            className="form-control  h-25 fieldwidth"
            placeholder="Enter Employee Name"
            name="name"
            value={name}
            onChange={searchName}
          />
          <select
            className="form-select  h-25 fieldwidth"
            placeholder="Enter Employee Name"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option></option>
            {roles.map((list, index) => {
              return <option key={index}>{list}</option>;
            })}
          </select>
          <select
            className="form-select h-25 fieldwidth"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option></option>
            <option>Bangalore</option>
            <option>Hyderabad</option>
            <option>Tirupati</option>
          </select>
          <select
            className="form-select  h-25 fieldwidth"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
          <button
            type="submit "
            className="btn btn-outline-info  h-25 fieldwidth"
            onClick={hanldeSearch}
          >
            {" "}
            Search
          </button>
          <button
            type="button"
            className="btn btn-outline-danger h-25 fieldwidth"
            onClick={hanldeClear}
          >
            {" "}
            Clear
          </button>
        </div>
      )}

      <Dialog
        isOpen={successUp}
        onDismiss={handleSuccessClose}
        className="dialogbox"

      >
        <div className="close-button">
          <IconButton onClick={handleSuccessClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Tabs>
          <TabList className="tabsnav">
            <Tab className="tabH1">Profile</Tab>
            <Tab className="tabH2">Documets</Tab>
          </TabList>
          <TabPanels className="contentDetails">
            <TabPanel >
              <Tabs>
                <TabList className="tabsnavinner ms-5 mt-2" id="tabinner">
                  <Tab className="tabH1" >Employee Details</Tab>
                  <Tab className="tabH2">Laptop Details</Tab>
                  <Tab className="tabH1">Hike Details</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div>
                      <div className="HeadingImage" title='View'>
                        <img src={employeeImg} alt="" onClick={zoomImage} />
                        <Dialog
                          isOpen={imagepopup}
                          onDismiss={handleClose}
                          className="dialogbox"
                        >
                          <div className="close-button">
                            <IconButton onClick={handleClose}>
                              <CloseIcon />
                            </IconButton>
                          </div>

                          <Tabs>
                            <TabPanels className="contentDetails">
                              <TabPanel>
                                <img
                                  src={employeeImg}
                                  alt="img"
                                  height='430'
                                  style={{ width: "100%" }}
                                />
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        </Dialog>
                      </div>
                    </div>
                    <form className="PopUpDetails">
                      <div className="empList row">
                        <span className="col col-lg-6">Employee Id :</span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {" "}
                          {window.localStorage.getItem("EMP_ID")}
                        </span>
                        <span className="col col-lg-6">Full Name :</span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {localStorage.getItem("FULLNAME")}{" "}
                        </span>
                        <span className="col col-lg-6">Designation : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("DEGINATION")}
                        </span>
                        <span className="col col-lg-6">Hired For : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("HIREDAS")}
                        </span>
                        <span className="col col-lg-6">Gender : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("GENDER")}
                        </span>
                        <span className="col col-lg-6">Mobile No : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("MOB_NO")}
                        </span>
                        <span className="col col-lg-6">
                          Alternate Mobile No :{" "}
                        </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("ALT_MOB")}
                        </span>
                        <span className="col col-lg-6">Email : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("EMAIL")}
                        </span>
                        <span className="col col-lg-6">Qualification : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("QUALIFICATION")}
                        </span>
                        <span className="col col-lg-6">DOB :</span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {" "}
                          {moment(window.localStorage.getItem("DOB")).format(
                            "MMM Do, YYYY"
                          )}{" "}
                        </span>
                        <span className="col col-lg-6">DOJ :</span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {" "}
                          {moment(window.localStorage.getItem("DOJ")).format(
                            "MMM Do, YYYY"
                          )}{" "}
                        </span>
                        <span className="col col-lg-6">
                          Last Working Date :
                        </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {" "}
                          {moment(window.localStorage.getItem("LWD")).format(
                            "MMM Do, YYYY"
                          )}{" "}
                        </span>
                        <span className="col col-lg-6">Current Location :</span>{" "}
                        <span className="col-6" style={{ color: "#000000" }}>
                          {window.localStorage.getItem("CRNTLOCATION")}
                        </span>
                        <span className="col col-lg-6">Primary Location :</span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {" "}
                          {window.localStorage.getItem("P_LOC")}
                        </span>
                        <span className="col col-lg-6">Primary Skill : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("P_SKILLS")}
                        </span>
                        <span className="col col-lg-6">Secondary Skill : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("S_SKILLS")}
                        </span>
                        <span className="col col-lg-6">Fixed CTC : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("FIXED_CTC")}
                        </span>
                        <span className="col col-lg-6">Variable Pay : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("VARIABLE_PAY")}
                        </span>
                        <span className="col col-lg-6">Experience : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("EXPERIENCE")}
                        </span>
                        <span className="col col-lg-6">UAN : </span>
                        <span
                          className="col col-lg-6"
                          style={{ color: "#000000" }}
                        >
                          {window.localStorage.getItem("UAN")}
                        </span>
                      </div>
                    </form>
                  </TabPanel>
                  <TabPanel>
                    <form className="PopUpDetails">
                      <div className="empList row">
                        <div className='Border'>
                          <table className="table table-hover table-sm">
                            <thead>
                              <tr>
                                {
                                  headingforLaptop.map((data, index) => (

                                    <td key={index} style={{ fontWeight: '600', color: '#252F40', fontSize: '14px' }}>{data}</td>

                                  ))
                                }
                              </tr>

                            </thead>
                            <tbody >
                              {
                                laptopData.map((data, index) => {
                                  return <tr key={index}  >
                                    <td >{moment(data.issueDate).format('MMM Do, YYYY')}</td>
                                    <td >{data.srNo}</td>
                                    {(data.returnDate) == null ? <td> {data.returnDate} </td> : <td>{moment(data.returnDate).format('MMM Do, YYYY')}</td>}
                                    {(data.replaceDate) == null ? <td> {data.replaceDate} </td> : <td>{moment(data.replaceDate).format('MMM Do, YYYY')}</td>}
                                    {(data.returnStatus) ? <td style={{ color: "green" }}> Yes </td> : <td style={{ color: "red" }}> No </td>}
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </form>
                  </TabPanel>
                  <TabPanel>
                    <form className="PopUpDetails">
                      <div className="empList row">
                        <div className='Border'>
                          <table className="table table-hover table-sm">
                            <thead>
                              <tr>
                                {
                                  headingforPopup.map((data, index) => (

                                    <td key={index} style={{ fontWeight: '600', color: '#252F40', fontSize: '14px' }}>{data}</td>

                                  ))
                                }
                              </tr>

                            </thead>
                            <tbody >
                              {
                                hikeDetails.map((data, index) => {
                                  return <tr key={index}  >
                                    <td >{moment(data.effectiveDate).format('MMM Do, YYYY')}</td>
                                    <td >{data.hikeAmount}</td>
                                    <td>{data.hikeVariablePay}</td>
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
            <TabPanel>
              <div className="PopUpDetails">
                <div className="empList row">
                  {/* <button onClick={window.location.reload(false)}> Show Docs </button> */}
                  {/* <span className='col col-lg-6'>DocumentationId :</span> <span className='col col-lg-6' style={{ color: '#000000' }}> <a href={window.localStorage.getItem("DOCUMENTATION_ID")} target="_blank"></a>Id</span> */}
                  <span className="col col-lg-7">EmployeeImage :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    <a
                      href={window.localStorage.getItem("EMPLOYEEIMAGE")}
                      target="_blank"
                    >
                      {" "}
                      {window.localStorage.getItem("EMPLOYEEIMAGE") ==
                        "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}{" "}
                    </a>{" "}
                  </span>
                  <span className="col col-lg-7">Certificate10th :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    <a
                      href={window.localStorage.getItem("CERTIFICATE10TH")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("CERTIFICATE10TH") ==
                        "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>{" "}
                  </span>
                  <span className="col col-lg-7">Certificate12th :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("CERTIFICATE12TH")}
                      target="_blank"
                    >
                      {" "}
                      {window.localStorage.getItem("CERTIFICATE12TH") ==
                        "null" ? (
                        ""
                      ) : (
                        <h6>Download</h6>
                      )}{" "}
                    </a>{" "}
                  </span>
                  <span className="col col-lg-7">Graduation :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("GRADUATION")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("GRADUATION") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span className="col col-lg-7">PostGraduation :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("POSTGRADUATION")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("POSTGRADUATION") ==
                        "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span className="col col-lg-7">PaySlip :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("PAYSLIP")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("PAYSLIP") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span className="col col-lg-7">OfferLetter1 :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("OFFERLETTER1")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("OFFERLETTER1") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span span className="col col-lg-7">
                    OfferLetter2 :
                  </span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("OFFERLETTER2")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("OFFERLETTER2") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span className="col col-lg-7">OfferLetter3 :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("OFFERLETTER3")}
                      target="_blank"
                    >
                      {window.localStorage.getItem("OFFERLETTER3") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}
                    </a>
                  </span>
                  <span className="col col-lg-7">Resume :</span>{" "}
                  <span className="col col-lg-5" style={{ color: "#000000" }}>
                    {" "}
                    <a
                      href={window.localStorage.getItem("RESUME")}
                      target="_blank"
                    >
                      {" "}
                      {window.localStorage.getItem("RESUME") == "null" ? (
                        ""
                      ) : (
                        <h6> Download </h6>
                      )}{" "}
                    </a>
                  </span>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Dialog>

      <div className="Border ">
        <table className="table table-sm table-hover mb-0 tablecontent">
          <thead>
            <tr className="pos">
            <th onClick={() => sorting('fullName')}><span className='me-2'>Name</span> <span className="bi bi-arrow-down-up"></span></th>
              {heading.map((data, index) => (
                <th key={index}>{data}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((data, index) => {
              return (
                <tr key={index}>
                  <Tooltip title={data.fullName}>
                    <td
                      style={{ color: "#2562AB", cursor: "pointer" }}
                      onClick={() => handleSuccessUp(data)}
                    >
                      {data.fullName.substring(0, 20)}
                    </td>
                  </Tooltip>
                  <td>{data.empId}</td>
                  <Tooltip title={data.email}>
                    <td data-tip data-for="registerTip">
                      {data.email.substring(0, data.email.lastIndexOf("@"))}
                    </td>
                  </Tooltip>
                  <td>{moment(data.dateOfJoining).format("DD-MM-YYYY")}</td>
                  <td>{data.degination}</td>
                  <td >{data.role}</td>
                  <td>{data.primaryLocation}</td>
                  <td>{data.mobileNo}</td>
                  <td>{data.bill}</td>
                  <td>{data.ctc}</td>
                  <Tooltip title="Assigned Lap">
                    <td onClick={() => Laptop(data.employeeDetailsId)} className='EDIcons'>
                      {/* <Link to="/profilepage/assignlaptop"> */}
                      <LaptopIcon />
                      {/* </Link> */}
                    </td>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <td
                      onClick={() => Edit(data)}
                      className="bi bi-pen-fill EDIcons"
                    ></td>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <td
                      className="bi bi-trash3-fill EDIcons"
                      style={{ color: "red" }}
                      onClick={() => onDelete(data.employeeDetailsId)}
                    ></td>
                  </Tooltip>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={data.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={data}
        />
      </div>
    </>
  );
}

export default EmplooyeeList;

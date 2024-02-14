import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';

const EmployeeRole = () => {
  const [employeerole, setEmployeerole] = useState([]);
  const [role, setRole] = useState("");
  const [employee, setEmployee] = useState("");
  const [details, setDetails] = useState([]);

  const heading = ['Employee Name', 'EmailId', 'Designation', 'Role', 'Access Role', 'Status'];

  useEffect(() => {
    const GetEmployee = () => {
      axios.get(`${global.API_URL}/smg/employee/getAllEmployeeList`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      }).then((res) => {
        // console.log("Fetch successfully", res.data);
        setEmployeerole(res.data);

      }).catch((err) => {
        console.log("some error", err);
      })
    }

    GetRoleDetails()
    GetEmployee()
  }, []);

  const GetRoleDetails = () => {
    axios.get(`${global.API_URL}/smg/admin/getAllAdmin`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      // console.log("response", res.data);
      setDetails(res.data)
    }).catch((err) => {
      console.log("error", err);
    })
  }

  const AssignRole = (e) => {
    e.preventDefault();
    axios.post(`${global.API_URL}/smg/admin/access?name=${employee}&role=${role}`, {}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    })
      .then((res) => {
        // console.log("response", res.data);
        setRole("");
        if (res.data == 'access provided') {
          toast.success(`${role} Access Provided to ${employee}`)

          GetRoleDetails();
          setEmployee("");

        }
        else if (res.data == "already access have") {
          toast.error(`${employee} has already access`)
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
  }


  const onDelete = (adminId) => {
    axios.put(`${global.API_URL}/smg/admin/removeAccess/${adminId}`, {}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`,

      }
    })
      .then((res) => {
        if (res.data == "access remove") {
          // console.log("delete success", res);
          alert("Want to delete?");
          GetRoleDetails();
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
  }

  function handleDragStart(event, index) {
    event.dataTransfer.setData("index", index);
  }

  function handleDragOver(event, index) {
    event.preventDefault();
  }

  function handleDrop(event, index) {
    const dragIndex = event.dataTransfer.getData("index");
    const dragItem = details[dragIndex];
    const newList = [...details];
    newList.splice(dragIndex, 1);
    newList.splice(index, 0, dragItem);
    setDetails(newList);
  }

  return (
    <>
      <div>
        <form onSubmit={AssignRole}>
          <h5>Assign Role</h5>
          <div className='d-flex justify-content-around'>
            <div>
              <label className='form-label'>Employee Name <sup className='star'>*</sup></label>
              <select className='form-select w-100' name="employee" value={employee} onChange={(e) => setEmployee(e.target.value)}  >
                <option>Select</option>
                {
                  employeerole.map((element) => {
                    return <option key={element.empId} >{element.fullName}</option>
                  })
                }
              </select>
            </div>
            <div>
              <label className='form-label' >Role <sup className='star'>*</sup></label>
              <div>
                <input type='radio' name="role" value="SUPER_ADMIN" onChange={(e) => setRole(e.target.value)} /> Super Admin   <br />
                <input type='radio' name="role" value="ADMIN" onChange={(e) => setRole(e.target.value)} /> Admin
              </div>
            </div>
            <button type='submit' className='btn btn-success Btn'>Assign Role</button>
          </div>
        </form>
      </div>

      <hr />
      <h5>Admins</h5>
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
              details.map((data, index) => {
                return <tr key={index}
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={(event) => handleDragOver(event, index)}
                  onDrop={(event) => handleDrop(event, index)}
                >
                  <td >{data.fullName}</td>
                  <td >{data.email}</td>
                  <td >{data.degination}</td>
                  <td >{data.role}</td>
                  <td >{data.accessRole}</td>
                  <>{data.status ? <td style={{ color: "green" }}> Active </td> : <td style={{ color: "red" }}>Inactive</td>}</>
                  <Tooltip title='Delete'>
                    <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => onDelete(data.employeeDetailsId)}
                    >
                    </td>
                  </Tooltip>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployeeRole;

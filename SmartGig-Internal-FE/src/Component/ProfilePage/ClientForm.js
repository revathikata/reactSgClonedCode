import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import "../API/api"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination from './Pagination/Pagination';
import * as XLSX from 'xlsx';

let PageSize = 15

const initialDataClient = {
  clientName: "",
  location: "",
  address: '',
  contactNumber: '',
  emailId: '',
  gst: '',
  spocName: '',
}

const ClientForm = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [datalist, setDatalist] = useState([]);
  const heading = ['Client Name', 'Location', "GST_No", "SPOC_Name", "Contact_No", "Status"];
  const [data, setData] = useState(initialDataClient);
  const { clientName, location, address, contactNumber, emailId, gst, spocName } = data;

  const [clientData, setClientData] = useState([]);
  const [clientState, setClientState] = useState('');
  const [locationState, setLocationState] = useState('');

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return datalist.slice(firstPageIndex, lastPageIndex);

  }, [currentPage, datalist]);


  const onDeleteClient = (clientId) => {
    axios.get(`${global.API_URL}/smg/client/getNoOfActiveProjectAndEmp/${clientId}`,
      {
        headers: {
          'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
        }
      })
      .then((res) => {
        if (window.confirm(`This client has ${res.data.NoOfActiveEmp} active employee And ${res.data.NoOfActiveProject} active project. Do you want to delete this client`)) {
          axios.post(`${global.API_URL}/smg/client/deleteClientDetails/${clientId}`, {}, {
            headers: {
              'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
          })
            .then(() => {
              GetClientDetails();
            })
            .catch((err) => {

            })
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
  }

  const inputHandle = (e) => {
    setData({
      ...data,
      [e.target.name]: [e.target.value]
    })
  }

  const handleSubmitClient = (e) => {
    e.preventDefault();
    axios.post(`${global.API_URL}/smg/client/addClient`, {
      clientName: `${clientName}`,
      location: `${location}`,
      status: true,
      address: address,
      contactNumber: contactNumber,
      emailId: emailId,
      gst: gst,
      spocName: spocName
    }, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((response) => {
      console.log(response.data)
      const client = response
      if (response.data.msg == "client added") {
        setDatalist(olddatalist => [...olddatalist, client])
        toast.success("Client added!");
        GetClientDetails();
        setData(initialDataClient)
      }
      else if (response.data.msg == "this client already present") {
        toast.warning(`${clientName} is already present`)
        setData(initialDataClient)
      }
    }).catch((err) => {
      console.log("some error here", err);
    })
  }

  const GetClientDetails = async () => {
    await axios.get(`${global.API_URL}/smg/client/getAllClientDetails`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
      }
    }).then((res) => {
      // console.log("Fetched", res.data);
      setDatalist(res.data)
      setClientData(res.data)
    }).catch((err) => {
      console.log("some error", err);
    })
  }

  useEffect(() => {
    GetClientDetails();
  }, [])

  const searchLocation = (e) => {
    const getStatus = e.target.value;
    if (getStatus.length > 0) {
      const searchData = clientData.filter((data) =>
        data.location.toLowerCase().includes(getStatus)
      )
      setDatalist(searchData);
    } else {
      setDatalist(clientData);
    }

    setLocationState(getStatus);
  };

  const searchClient = (e) => {
    const getclient = e.target.value;
    if (getclient.length > 0) {
      const searchData = clientData.filter((data) =>
        data.clientName.toLowerCase().includes(getclient)
      )
      setDatalist(searchData);
    }
    else {
      setDatalist(clientData);
    }

    setClientState(getclient);
  };

  const exportSheet = () => {
    const filteredData = datalist.map(item => {
      return item;
    });
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, "ClientData");
    XLSX.writeFile(wb, "ClientData.xlsx");
  }

  return (
    <>
      <form onSubmit={handleSubmitClient}>
        <h5>Add Client</h5>
        <div className='ClientField'>
          <div>
            <label className='form-label'>Client Name <sup >*</sup></label>
            <input type="text" value={clientName} required name="clientName" onChange={inputHandle} className='form-control ' placeholder='Enter client name' />
          </div>

          <div>
            <label className='form-label'>Client Location <sup>*</sup></label>
            <select value={location} required name="location" onChange={inputHandle} className='form-select'>
              <option></option>
              <option>Australia</option>
              <option>Bangalore</option>
              <option>Canada</option>
              <option>Chennai</option>
              <option>Dubai</option>
              <option>Germany</option>
              <option>Hyderabad</option>
              <option>Ireland</option>
              <option>Mumbai</option>
              <option>Nagpur</option>
              <option>Pune</option>
              <option>Singapore</option>
              <option>Tirupati</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <button type='submit' className='btn btn-success  Btn' >Add Client</button>

        </div >
      </form >
      <hr />
      <h5 style={{ marginTop: "20px" }}>Client Details</h5>

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
          placeholder="Search By Location"
          name="locationState"
          value={locationState}
          onChange={searchLocation}
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
              currentTableData && currentTableData.map((items, index) => {
                return <tr key={index}>
                  <td>{items.clientName}</td>
                  <td>{items.location}</td>
                  <td>{items.gst}</td>
                  <td>{items.spocName}</td>
                  <td>{items.contactNumber}</td>
                  <>{items.status ? <td style={{ color: "green" }}> Active </td> : <td style={{ color: "red" }}>Inactive</td>}</>
                  <Tooltip title='Edit'><td ><Link to={"/profilepage/updateclient/" + items.clientId} className='bi bi-pen-fill' style={{ cursor: 'pointer', color: 'black' }}></Link></td>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <td className='bi bi-trash3-fill' style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteClient(items.clientId)}></td>
                  </Tooltip>
                </tr>
              })
            }
          </tbody>
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={datalist.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={datalist}
        />
      </div>
    </>
  );
}

export default ClientForm;

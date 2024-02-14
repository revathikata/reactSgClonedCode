import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState, useMemo} from 'react';
import "../API/api"
import * as XLSX from 'xlsx';
import './Profile.css'
import Pagination from './Pagination/Pagination';

let PageSize = 15

const LaptopDetails = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isReturn, setIsReturn] = useState(false)
    const [laptop, setLaptop] = useState([]);
    const [assignName, setAssignNmae] = useState('')
    const [filter, setFilter] = useState([])
    const heading = ['Assigned To','DOI', 'Serial No', 'Returned Date', 'ReplaceDate',  'ReturnStatus']
    
    const currentTableData = useMemo(() => {

      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return laptop.slice(firstPageIndex, lastPageIndex);
  
    }, [currentPage, laptop]);

    useEffect(()=>{
        axios.get(`${global.API_URL}/smg/assignedLap/getAllAssignedLaptops/${isReturn}`, {
            headers: {

                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        }).then((res)=>{
          console.log(res)
            setLaptop(res.data)
            setFilter(res.data)
        }).catch((error)=>{
            console.log("Got Error", error)
        })

        }, [])

        const exportSheet = () => {
          var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(laptop);
          XLSX.utils.book_append_sheet(wb, ws, "Assigned_LaptopData");
          XLSX.writeFile(wb, "Assigned_LaptopData.xlsx");
        }

        const searchName = (e) => {
          const getSearch = e.target.value;
          if (getSearch.length > 0) {
            const searchData = laptop.filter((laptop) =>
              laptop.empName.toLowerCase().includes(getSearch)
            );
            setLaptop(searchData);
          } else {
            setLaptop(filter);
          }
          setAssignNmae(getSearch);
        };

        const findStatus=(isReturn)=>{
          axios.get(`${global.API_URL}/smg/assignedLap/getAllAssignedLaptops/${isReturn}`,{
            headers: {
              
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
           }).then((res)=>{
            console.log(res.data)
            setLaptop(res.data)
            setFilter(res.data)
           }).catch((error)=>{
            console.log("error while fetching data", error)
           }) 
        }
       
        
  return (
    <div>
      <div className='d-flex justify-content-between'>
      <h5>Assigned Laptops</h5>
      <input
            className="form-control w-25"
            placeholder="Enter employee name"
            name="searchNo"
            value={assignName}
            onChange={searchName}
          />
           <div>
            <select className='form-select ' onChange={(e)=> findStatus(e.target.value)}>
              <option value='false'>Not Returned</option>
              <option value='true'>Returned </option>
            </select>
          </div>
      <button className="btn btn-outline-dark btn-sm" onClick={exportSheet}>
          Export Sheet
        </button>
      </div>
     
      <hr />
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
               currentTableData.map((items, index) => {
                return <tr key={index}>
                 <td>{items.empName}</td>
                 <td>{moment(items.issueDate).format("DD-MM-YYYY")}</td>
                 <td>{items.srNo}</td>
                 <td>{items.returnDate =='null'?moment(items.returnDate).format("DD-MM-YYYY"):''}</td>
                 <td>{items.replaceDate =='null'?moment(items.replaceDate).format("DD-MM-YYYY"):''}</td>
                 <>{items.returnStatus?<td>Yes</td>:<td>No</td>}</>
                 </tr>
              })
            }
          </tbody>  
        </table>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={laptop.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
          data={laptop}
        />
      </div>
    </div>
  );
}

export default LaptopDetails;

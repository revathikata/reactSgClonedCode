import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../API/api"
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditDocs = () => {
    const navigate = useNavigate();
    const [employeeimage, setEmployeeimage] = useState(new File([""], "file"));
    const [certificate10th, setCertificate10th] = useState(new File([""], "file"));
    const [certificate12th, setCertificate12th] = useState(new File([""], "file"));
    const [graduation, setGraduation] = useState(new File([""], "file"));
    const [postGraduation, setPostGraduation] = useState(new File([""], "file"));
    const [offerLetter1, setOfferLetter1] = useState(new File([""], "file"));
    const [offerLetter2, setOfferLetter2] = useState(new File([""], "file"));
    const [offerLetter3, setOfferLetter3] = useState(new File([""], "file"));
    const [paySlip, setPaySlip] = useState(new File([""], "file"));
    const [resume, setResume] = useState(new File([""], "file"));
    const [errormsg, setErrorMsg] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    function onFileUpload1(e) {
        setEmployeeimage(e.target.files[0]);
    }
    function onFileUpload2(e) {
        setCertificate10th(e.target.files[0]);
    }
    function onFileUpload3(e) {
        setCertificate12th(e.target.files[0]);
    }
    function onFileUpload4(e) {
        setGraduation(e.target.files[0]);
    }
    function onFileUpload5(e) {
        setPostGraduation(e.target.files[0]);
    }
    function onFileUpload6(e) {
        setPaySlip(e.target.files[0]);
    }
    function onFileUpload7(e) {
        setOfferLetter1(e.target.files[0]);
    }
    function onFileUpload8(e) {
        setOfferLetter2(e.target.files[0]);
    }
    function onFileUpload9(e) {
        setOfferLetter3(e.target.files[0]);
    }
    function onFileUpload10(e) {
        setResume(e.target.files[0]);
    }

    // handle submit button for form
    function handleSubmit(e) {
        e.preventDefault();
        // const MAX_FILE_SIZE = 5120 // 5MB
        // const fileSizeKiloBytes = employeeimage.size / 1024
        //  setEmployeeimage(fileSizeKiloBytes)
        // const formData = new FormData();
        // if(employeeimage > MAX_FILE_SIZE){
        //     setErrorMsg("File size is greater than 5 MB");
        //     // setIsSuccess(false)
        //     return
        //   } else if (employeeimage) {
        //     formData.append('employeeImage', employeeimage);
        // }
        const formData = new FormData();
        formData.append('employeeImage', employeeimage);
        formData.append('certificate10th', certificate10th)
        formData.append('certificate12th', certificate12th)
        formData.append('graduation', graduation)
        formData.append('postGraduation', postGraduation)
        formData.append('offerLetter1', offerLetter1)
        formData.append('offerLetter2', offerLetter2)
        formData.append('offerLetter3', offerLetter3)
        formData.append('paySlip', paySlip)
        formData.append('resume', resume)

        axios.post(`${global.API_URL}/smg/employee/uploadoc/${window.localStorage.getItem("EDIT_ID")}`, formData, {
            headers: {
                'Content-Type': 'multipart / form-data',
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                // console.log("docs successfull updated", res.data);
                toast.success("Documents Updated Successfully")
                navigate("/profilepage/employeelist");
            })
            .catch((error) => {
                console.log("some error during docs uplaod", error);
            })

    }

    const handleCancel = () => {
        navigate("/profilepage/employeelist")
    }

    return (
        <form onSubmit={handleSubmit} className="upload--container">
            <div className='mainWrapper'>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'> Upload Photo </label>
                        <input type="file" onChange={onFileUpload1} className='form-control w-75' placeholder='Enter Client name' />
                        <a className='style' href={window.localStorage.getItem("EMPLOYEEIMAGE")} target="_blank" download> {(window.localStorage.getItem("EMPLOYEEIMAGE") == "null")? "" : <h6> View </h6>}  </a>
                   {/* {isSuccess ? <p className="success-message">Validation successful</p> : null} */}
          {/* <p className="error-message" style={{color:'red'}}>{errormsg}</p> */}

                    </div>
                    <div>
                        <label className='form-label'> Xth Marksheet </label>
                        <input type="file" onChange={onFileUpload2} className='form-control w-75' placeholder='Enter Client name' />
                        <a className='style' href={window.localStorage.getItem("CERTIFICATE10TH")} target="_blank">{(window.localStorage.getItem("CERTIFICATE10TH") == "null")? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>XIIth/Diploma Marksheet </label>
                        <input type="file" onChange={onFileUpload3} className='form-control w-75' placeholder='Enter Project name' />
                        <a className='style' href={window.localStorage.getItem("CERTIFICATE12TH")} target="_blank" > {(window.localStorage.getItem("CERTIFICATE12TH") == "null")? "" : <h6>View</h6>} </a>
                    </div>

                </div>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'> UG Marksheet </label>
                        <input type="file" onChange={onFileUpload4} className='form-control w-75' placeholder='Enter employee name' />
                        <a className='style' href={window.localStorage.getItem("GRADUATION")} target="_blank">{(window.localStorage.getItem("GRADUATION") == "null")? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>PG Marksheet</label>
                        <input type="file" onChange={onFileUpload5} className='form-control w-75' placeholder='Enter employee name' />
                        <a className='style' href={window.localStorage.getItem("POSTGRADUATION")} target="_blank">{(window.localStorage.getItem("POSTGRADUATION") == "null") ? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>Company Payslip</label>
                        <input type="file" onChange={onFileUpload6} className='input-group form-control w-75' />
                        <a className='style' href={window.localStorage.getItem("PAYSLIP")} target="_blank">{(window.localStorage.getItem("PAYSLIP") == "null") ? "" : <h6> View </h6>}</a>

                    </div>
                </div>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'>Company Offer Letter 1 </label>
                        <input type="file" onChange={onFileUpload7} className='input-group form-control w-75' />
                        <a className='style' href={window.localStorage.getItem("OFFERLETTER1")} target="_blank">{(window.localStorage.getItem("OFFERLETTER1") == "null") ? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>Company Offer Letter 2 </label>
                        <input type="file" onChange={onFileUpload8} className='input-group form-control w-75' />
                        <a className='style' href={window.localStorage.getItem("OFFERLETTER2")} target="_blank">{(window.localStorage.getItem("OFFERLETTER2") == "null") ? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>Company Offer Letter 3</label>
                        <input type="file" onChange={onFileUpload9} className='input-group form-control w-75' />
                        <a className='style' href={window.localStorage.getItem("OFFERLETTER3")} target="_blank">{(window.localStorage.getItem("OFFERLETTER3") == "null") ? "" : <h6> View </h6>}</a>

                    </div>
                    <div>
                        <label className='form-label'>Resume</label>
                        <input type="file" onChange={onFileUpload10} className='input-group form-control w-75' />
                        <a className='style' href={window.localStorage.getItem("RESUME")} target="_blank"> {(window.localStorage.getItem("RESUME") == "null") ? "" : <h6> View </h6>} </a>

                    </div>
                </div>
            </div>
            <div className='Formbtngroup'>
                <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                <button className='btn fw-bold' onClick={handleCancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>cancel</button>
            </div>
        </form>
    );
};

export default EditDocs;
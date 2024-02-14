import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../API/api"
import { useNavigate } from 'react-router-dom';
import EmployeesDetails from './EmployeesDetails';
import { toast } from 'react-toastify';

const data = {
    employeeImageCan: new File([""], "file"), certificate10thCan: new File([""], "file"), certificate12thCan: new File([""], "file"), graduationCan: new File([""], "file"), postGraduationCan: new File([""], "file"),
    offerLetter1Can: new File([""], "file"), offerLetter2Can: new File([""], "file"), offerLetter3Can: new File([""], "file"), paySlipCan: new File([""], "file"), resumeCan: new File([""], "file"),
}


const MultipleFileInput = () => {
    const navigate = useNavigate()
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

    const { employeeImageCan, certificate10thCan, certificate12thCan, graduationCan, postGraduationCan,
        offerLetter1Can, offerLetter2Can, offerLetter3Can, paySlipCan, resumeCan } = data

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
        setOfferLetter1(e.target.files[0]);
    }
    function onFileUpload7(e) {
        setOfferLetter2(e.target.files[0]);
    }
    function onFileUpload8(e) {
        setOfferLetter3(e.target.files[0]);
    }
    function onFileUpload9(e) {
        setPaySlip(e.target.files[0]);
    }
    function onFileUpload10(e) {
        setResume(e.target.files[0]);
    }


    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        if (employeeimage) {
            formData.append('employeeImage', employeeimage);
        }
       
        if (certificate10th) {
            formData.append('certificate10th', certificate10th)
        }
        if (certificate12th) {
            formData.append('certificate12th', certificate12th)
        } if (graduation) {
            formData.append('graduation', graduation)
        }
        formData.append('postGraduation', postGraduation)
        formData.append('offerLetter1', offerLetter1)
        formData.append('offerLetter2', offerLetter2)
        formData.append('offerLetter3', offerLetter3)
        formData.append('paySlip', paySlip)
        formData.append('resume', resume)

        axios.post(`${global.API_URL}/smg/employee/uploadoc/${window.localStorage.getItem("EMP_ID_FOR_DOCUMENT")}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                toast.success("Documents Uploaded Successfully")
                navigate("/profilepage/assignlaptop");
            })
            .catch((error) => {
                console.log("some error during docs uplaod", error);
            })

    }

    const handleCancel = (e) => {

        e.preventDefault();
        const formData = new FormData();
        if (employeeimage) {
            formData.append('employeeImage', employeeImageCan);
        }
        if (certificate10th) {
            formData.append('certificate10th', certificate10thCan)
        }
        if (certificate12th) {
            formData.append('certificate12th', certificate12thCan)
        } if (graduation) {
            formData.append('graduation', graduationCan)
        }
        formData.append('postGraduation', postGraduationCan)
        formData.append('offerLetter1', offerLetter1Can)
        formData.append('offerLetter2', offerLetter2Can)
        formData.append('offerLetter3', offerLetter3Can)
        formData.append('paySlip', paySlipCan)
        formData.append('resume', resumeCan)

        axios.post(`${global.API_URL}/smg/employee/uploadoc/${window.localStorage.getItem("EMP_ID_FOR_DOCUMENT")}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem("TOKEN"))}`
            }
        })
            .then((res) => {
                navigate("/profilepage/assignlaptop");
            })
            .catch((error) => {
                console.log("some error during docs uplaod", error);
            })

    }


    return (
        <form onSubmit={handleSubmit} className="upload--container">
            <div className='mainWrapper'>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'> Upload Photo <sup>*</sup></label>
                        <input type="file" onChange={onFileUpload1} className='form-control w-75' placeholder='Enter Client name' />
                        {isSuccess ? <p className="success-message">Validation successful</p> : null}
          <p className="error-message">{errormsg}</p>

                    </div>
                    <div>
                        <label className='form-label'> Xth Marksheet <sup>*</sup></label>
                        <input type="file" onChange={onFileUpload2} className='form-control w-75' placeholder='Enter Client name' />
                    </div>
                    <div>
                        <label className='form-label'>XIIth/Diploma Marksheet <sup>*</sup></label>
                        <input type="file" onChange={onFileUpload3} className='form-control w-75' placeholder='Enter Project name' />
                    </div>

                </div>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'> UG Marksheet <sup>*</sup></label>
                        <input type="file" onChange={onFileUpload4} className='form-control w-75' placeholder='Enter employee name' />
                    </div>
                    <div>
                        <label className='form-label'>PG Marksheet</label>
                        <input type="file" onChange={onFileUpload5} className='form-control w-75' placeholder='Enter employee name' />
                    </div>
                    <div>
                        <label className='form-label'>Company Payslip</label>
                        <input type="file" onChange={onFileUpload6} className='input-group form-control w-75' />

                    </div>
                </div>
                <div className='inneroneD'>
                    <div>
                        <label className='form-label'>Company Offer Letter 1 </label>
                        <input type="file" onChange={onFileUpload7} className='input-group form-control w-75' />
                    </div>
                    <div>
                        <label className='form-label'>Company Offer Letter 2 </label>
                        <input type="file" onChange={onFileUpload8} className='input-group form-control w-75' />
                    </div>
                    <div>
                        <label className='form-label'>Company Offer Letter 3</label>
                        <input type="file" onChange={onFileUpload9} className='input-group form-control w-75' />
                    </div>
                    <div>
                        <label className='form-label'>Resume</label>
                        <input type="file" onChange={onFileUpload10} className='input-group form-control w-75' />
                    </div>

                </div>
            </div>
            <div className='Formbtngroup'>
                <button className='btn' type="submit" style={{ backgroundColor: '#225779', color: 'white', }} >Submit</button>
                <button className='btn fw-bold' onClick={handleCancel} style={{ backgroundColor: 'white', color: 'black', borderColor: 'red' }}>Skip to Next</button>
            </div>
        </form>
    );
};

export default MultipleFileInput;   
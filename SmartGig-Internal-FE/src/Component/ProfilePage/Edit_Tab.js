import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from 'react-router-dom';
import EditDocs from './EditDocs';
import EditLaptop from './EditLaptop';
import EditProfile from './EditProfile';
import './Profile.css'
import SalaryComponent from './SalaryComponent';


const EditTag = () => {
    const [key, setKey] = useState('home');
    return (
        <div>
            <Link className='bi bi-chevron-double-left backButton' to="/profilepage/employeelist" > Back</Link>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="home" title="Edit Profile">
                    <EditProfile />
                </Tab>
                <Tab eventKey="profile" title="Edit Documents">
                    <EditDocs />
                </Tab>
                <Tab eventKey="hike" title="Hike">
                    <SalaryComponent />
                </Tab>
                <Tab eventKey="laptop" title="Laptop Details">
                    <EditLaptop />
                </Tab>
            </Tabs>
        </div>
    );
}

export default EditTag;

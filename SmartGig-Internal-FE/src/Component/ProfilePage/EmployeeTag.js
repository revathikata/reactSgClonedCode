import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Docs from './Docs';
import EmployeesDetails from './EmployeesDetails';



const EmployeeTag = () => {
  const [key, setKey] = useState('home');
  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="Employee Details">
          <EmployeesDetails />
        </Tab>
        <Tab eventKey="profile" title="Documents">
          <Docs />
        </Tab>
      </Tabs>
    </div>
  );
}

export default EmployeeTag;

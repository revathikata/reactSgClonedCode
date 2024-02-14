import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ClientForm from './ClientForm';
import ProjectForm from './Project';



const ClientTag = () => {
  const [key, setKey] = useState('home');
  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="Client">
          <ClientForm />
        </Tab>
        <Tab eventKey="profile" title="Project">
          <ProjectForm />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ClientTag;

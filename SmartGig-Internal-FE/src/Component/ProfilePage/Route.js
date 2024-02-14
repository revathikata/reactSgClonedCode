import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from './Profile';
import Login from '../Login/Login';
import Billing from './Billing';
import PiechartData from './Piechartdata';
import EmplooyeeList from './EmplooyeeList'
import ClientTag from './ClientTags';
import UpdateProject from './UpdateProject';
import UpdateClient from './updateClient'
import AssignProject from './AssignProject';
import EditTag from './Edit_Tab';
import EmployeeRole from './EmployeeRole';
import Privatecomponent from '../Privatecomponent';
import Candidateform from './Candidateform';
import HrProfile from './HrProfile';
import Docs from './Docs';
import EmployeesDetails from './EmployeesDetails';
import BillingData from './ProfitLoss/BillingData';
import CandidateList from './CandidateList';
import Edit_Biliing from './Edit_Biliing';
import PrivateComponentForHrAdmin from '../PrivateComponentForHrAdmin';
import ClientForm from './ClientForm';
import ProjectForm from './Project';
import CandidateEdit from './CandidateEdit';
import Interview from './Interview';
import CandidateProfilePage from './CandidateProfilePage';
import ClientBilling from './ClientBilling';
import InterviewList from './InterviewList';
import InterviewEdit from './InterviewEdit';
import Zoom from '../ZOOM/zoom';
import PrivateComponentForEmployee from '../PrivateComponentForEmployee';
import EmpProfile from '../Employee/EmpProfile';
import PaySlip from '../Employee/PaySlip';
import ApplyLeave from '../Employee/ApplyLeave';
import EmployeeLeaveRecord from '../Employee/EmployeeLeaveRecord';
import HikeEligible from './HikeEligible';
import LaptopDetails from './AssignedLaptopDetails';
import LaptopData from './LaptopData';
import Addlaptop from './Addlaptop';
import AddlaptopEdit from './AddlaptopEdit';
import Notification from './Notification';

export default function RoutePage() {
    return (
        <div id="mainSection container-fluid">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />}>
                    </Route>

                    <Route element={<Privatecomponent />}>
                        <Route path="/profilepage" element={<Profile key="profilepage" />}>

                            <Route path="employeelist" element={< EmplooyeeList />}></Route>
                            <Route path="billing" element={<Billing />} > </Route>

                            <Route path="addemployee" element={<EmployeesDetails />} />
                            <Route path="documents" element={<Docs />} />
                            <Route path="piechart" element={<PiechartData />}></Route>
                            <Route path="editemployee" element={<EditTag />}></Route>
                            <Route path='updateproject' element={<UpdateProject />} />
                            <Route path='clientform' element={<ClientForm />} />
                            <Route path='projectform' element={<ProjectForm />} />
                            <Route path='updateclient'  >
                                <Route path=':id' element={<UpdateClient />} />
                            </Route>
                            <Route path='assignproject' element={<AssignProject />} />
                            <Route path='employeeRole' element={<EmployeeRole />} />
                            <Route path='profit&l' element={<BillingData />} />
                            <Route path='billingedit' element={<Edit_Biliing />} />
                            <Route path='clientbilling' element={<ClientBilling />} />
                            <Route path='meeting' element={<Zoom />} />
                            <Route path='hikeeligible' element={<HikeEligible />} />
                            <Route path='employeelaptop' element={<LaptopDetails />} />
                            <Route path='assignlaptop' element={<LaptopData />} />
                            <Route path='laptopadd' element={<Addlaptop />} />
                            <Route path='addlaptopedit/'  >
                                <Route path=':id' element={<AddlaptopEdit />} />
                            </Route>
                            <Route path='notification' element={<Notification />} />

                        </Route>
                    </Route>
                    <Route element={<PrivateComponentForHrAdmin />}>
                        <Route path="hrProfile" element={<HrProfile />}>
                            <Route path="candidateform" element={<Candidateform />}></Route>
                            <Route path="candidatelist" element={<CandidateList />} />
                            <Route path="candidatelist" element={<CandidateEdit />} >
                                <Route path=':id' element={<CandidateEdit />} />
                            </Route>
                            <Route path="candidateinterview"  >
                                <Route path=':id' element={<Interview />} />
                            </Route>
                            <Route path="candidateprofile/"  >
                                <Route path=':id' element={<CandidateProfilePage />} />
                            </Route>
                            <Route path="interviewlist" element={<InterviewList />} />
                            <Route path='interviewedit/'  >
                                <Route path=':id' element={<InterviewEdit />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route element={<PrivateComponentForEmployee />}>
                        <Route path='employeeProfile' element={<EmpProfile />}>
                            <Route path='applyLeave' element={<ApplyLeave />}></Route>
                            <Route path='paySlip' element={<PaySlip />}></Route>
                            <Route path="leavehistory" element={<EmployeeLeaveRecord />}></Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

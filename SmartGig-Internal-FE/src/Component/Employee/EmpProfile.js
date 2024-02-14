import React from 'react'
import Downbar1 from '../ProfilePage/Downbar1';
import "../ProfilePage/Profile.css"
import EmpSidebar1 from './EmpSidebar1'
import EmpSidebar2 from './EmpSidebar2'

export default function EmpProfile() {
    return (
        <div className='d-flex profileMain'>
            <div className='profSide1'>
                <EmpSidebar1 />
            </div>
            <div div className='profSide2' >
                <div>
                    <EmpSidebar2 />
                </div>
                <div className='DetailsSection' >
                    <Downbar1 />
                </div>
            </div>
        </div >
    )
}

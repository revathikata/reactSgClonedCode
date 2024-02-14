import React from 'react'
import Downbar1 from './Downbar1';
import "./Profile.css"
import Sidebar2HR from './Sidebar2HR';
import Sidebar1HR from './Sidebar1HR';

export default function HrProfile() {
    return (
        <div className='d-flex profileMain'>
            <div className='profSide1'>
                <Sidebar1HR />
            </div>
            <div div className='profSide2' >
                <div>
                    <Sidebar2HR />
                </div>
                <div className='DetailsSection' >
                    <Downbar1 />
                </div>
            </div>
        </div >
    )
}

import React from 'react'
import Downbar1 from './Downbar1';
import "./Profile.css"
import Sidebar1 from './Sidebar1';
import Sidebar2 from './Sidebar2';

export default function Profile() {
    return (
        <>
            <div className='d-flex profileMain'>
                <div className='profSide1'>
                    <Sidebar1 />
                </div>
                <div className='profSide2'>
                    <div>
                        <Sidebar2 />
                    </div>
                    <div className='DetailsSection' >
                        <Downbar1 />
                    </div>
                </div>
            </div>
        </>
    )
}

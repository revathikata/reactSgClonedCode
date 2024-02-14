import React from 'react'

export default function Notification() {

    let NotiArr = (JSON.parse(window.localStorage.getItem("NotificationArray")));
    var length = NotiArr.length;
    const heading = ["Name", "Description", "Date", "Image"];

    const ReadNoti = () => {
        const updated_counter = document.querySelector(".bell-notification");
        updated_counter.setAttribute("current-count", length - 1);
        if (length > 1) {
            length = length - 1;
        }
    }

    return (
        <div className='Border'>

            <table table className="table table-sm table-hover mb-0 tablecontent" >
                <thead>
                    <tr>
                        {
                            heading.map((data, index) => (

                                <th key={index} style={{ fontWeight: '600', color: '#252F40' }}>{data}</th>

                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        NotiArr.map((data, index) =>
                        (
                            <tr key={index} onClick={ReadNoti} >
                                <td>{data.Name}</td>
                                <td>{data.Description}</td>
                                <td>{data.Validdate}</td>
                                <td>{data.Files.map((data1) => (data1.Files))}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table >
        </div >
    )
}

import axios from 'axios';
import React, { useState } from 'react';

export default function Zoom() {

    const [username, setUsername] = useState("")
    const ZoomMeeting = () => {
        const data = {
            email: "swadeepkumar.d@smartgig.tech"
        }
        console.log(username);

        axios.post(`http://localhost:3444/meeting`, data)
            .then((response) => {
                let URL = response.data.join_url.replaceAll(
                    "http://us04web.zoom.us/j/",
                    "http://localhost:9999/?"
                ) + `role=1?name=${username}`;
                console.log(URL);
                window.location.replace(`${URL}`)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="App">
            <main>
                <h3>Zoom Meeting</h3>
                <label>
                    <input placeholder="Enter Your Name" className='form-control' type="text" name='name' value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <button className='btn btn-outline-success ms-3' onClick={ZoomMeeting}>Create Meeting</button>
            </main>
        </div>
    );
}
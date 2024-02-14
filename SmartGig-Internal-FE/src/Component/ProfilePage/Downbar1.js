import React from "react";
import { Outlet } from "react-router-dom";


export default function Downbar1() {

    return (
        <div className="containerinner">
            <nav>
            </nav >
            <Outlet />
        </div>
    );
}

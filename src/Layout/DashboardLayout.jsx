import React from 'react'
import { useState } from 'react'
import Topbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import style from './../styles/Sidebar.module.css';
import { Outlet } from 'react-router-dom';


const DashboardLayout = () => {

    const [isSandwichOpen,setIsSandwichOpen] = useState(false);
    const toggle = ()=>{
        setIsSandwichOpen((prev)=>!prev)
    }
    return (
        <div className={`d-flex flex-column ${style.dashboardLayout}`}>
            <Topbar toggle={toggle} isSandwichOpen={isSandwichOpen} />
            <div className={`fixed-top ${isSandwichOpen ? style.sidebarLayoutClose: style.sidebarLayout}`}>
                <Sidebar isSandwichOpen={isSandwichOpen} toggle={toggle}/>
            </div>
            <div className={`mt-5 ${style.content} ${isSandwichOpen? style.contentClose: ''}`}>
                    <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
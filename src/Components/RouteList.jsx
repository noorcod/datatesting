import React  from 'react';
import Laptops from "../Pages/Laptops/Laptops"
import DashboardLayout from '../Layout/DashboardLayout';
import Mobiles from '../Pages/Mobiles/Mobiles';
import LEDs from '../Pages/LEDs/LEDs';
import DesktopComputers from '../Pages/DesktopComputers/DesktopComputers';
import Accessories from '../Pages/Accessories/Accessories';
import AccesoryType from '../Pages/Data/AccessoryType';
import Brand from '../Pages/Data/Brand';

import { Route, Routes } from 'react-router-dom';

const Layout = () => {
    return (
        <Routes>
        <Route path='/' element={<DashboardLayout />}>
            <Route path='laptops' element={<Laptops />}>

            </Route>
            <Route path='mobiles' element={<Mobiles />}>

            </Route>
            <Route path='leds' element={<LEDs />}>

            </Route>
            <Route path='desktop-computers' element={<DesktopComputers />}>

            </Route>
            <Route path='accessories' element={<Accessories />}>

            </Route>
            <Route path='data' element={<AccesoryType />}>
                <Route path='accessory-type' element={<AccesoryType />} />
                <Route path='brand' element={<Brand />} />

            </Route>
        </Route> 
        </Routes>
    );
}
 
export default Layout;
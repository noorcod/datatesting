import Login from "./Pages/Login";
import { useSelector,useDispatch } from 'react-redux';
import Cookies from './Features/Cookies'
import { currentUser,authActions } from './Features/authSlice';
import { Routes, useLocation, Navigate, Outlet, Route } from "react-router-dom";
import { useLayoutEffect } from "react";


import Laptops from "./Pages/Laptops/Laptops"
import DashboardLayout from './Layout/DashboardLayout';
import Mobiles from './Pages/Mobiles/Mobiles';
import LEDs from './Pages/LEDs/LEDs';
import DesktopComputers from './Pages/DesktopComputers/DesktopComputers';
import Accessories from './Pages/Accessories/Accessories';
import AccesoryType from './Pages/Data/AccessoryType';
import Brand from './Pages/Data/Brand';

import Categories from './Pages/Data/Categories';
import Color from './Pages/Data/Color';
import Condition from './Pages/Data/Condition';
import DesktopType from './Pages/Data/DesktopType';
import Generation from './Pages/Data/Generation';
import GraphicCardSpecs from './Pages/Data/GraphicCardSpecs';
import GraphicCardType from './Pages/Data/GraphicCardType';
import LaptopType from './Pages/Data/LaptopType';
import ScreenSize from './Pages/Data/ScreenSize';
import Ports from './Pages/Data/Ports';
import Processor from './Pages/Data/Processor';
import Ram from './Pages/Data/Ram';
import RamType from './Pages/Data/RamType';
import RefreshRate from './Pages/Data/RefreshRate';
import Resolution from './Pages/Data/Resolution';
import ScreenType from './Pages/Data/ScreenType';
import Speaker from './Pages/Data/Speaker';
import Storage from './Pages/Data/Storage';
import Webcam from './Pages/Data/Webcam';
import AddAccesoryType from './Pages/Data/AddForms/AddAccessoryType';
import AddBrand from './Pages/Data/AddForms/AddBrand';
import AddCategories from './Pages/Data/AddForms/AddCategories';
import AddColor from './Pages/Data/AddForms/AddColor';
import AddCondition from './Pages/Data/AddForms/AddCondition';
import AddDesktopType from './Pages/Data/AddForms/AddDesktopType';
import AddGeneration from './Pages/Data/AddForms/AddGeneration';
import AddGraphicCardSpecs from './Pages/Data/AddForms/AddGraphicCardSpecs';
import AddGraphicCardType from './Pages/Data/AddForms/AddGraphicCardType';
import AddLaptopType from './Pages/Data/AddForms/AddLaptopType';
import AddScreenSize from './Pages/Data/AddForms/AddScreenSize';
import AddPorts from './Pages/Data/AddForms/AddPorts';
import AddProcessor from './Pages/Data/AddForms/AddProcessor';
import AddRam from './Pages/Data/AddForms/AddRam';
import AddRamType from './Pages/Data/AddForms/AddRamType';
import AddRefreshRate from './Pages/Data/AddForms/AddRefreshRate';
import AddResolution from './Pages/Data/AddForms/AddResolution';
import AddScreenType from './Pages/Data/AddForms/AddScreenType';
import AddSpeaker from './Pages/Data/AddForms/AddSpeaker';
import AddStorage from './Pages/Data/AddForms/AddStorage';
import AddWebcam from './Pages/Data/AddForms/AddWebcam';
import EditAccesoryType from './Pages/Data/EditForms/EditAccessoryType';
import EditBrand from './Pages/Data/EditForms/EditBrand';
import EditCategories from './Pages/Data/EditForms/EditCategories';
import EditColor from './Pages/Data/EditForms/EditColor';
import EditCondition from './Pages/Data/EditForms/EditCondition';
import EditDesktopType from './Pages/Data/EditForms/EditDesktopType';
import EditGeneration from './Pages/Data/EditForms/EditGeneration';
import EditGraphicCardSpecs from './Pages/Data/EditForms/EditGraphicCardSpecs';
import EditGraphicCardType from './Pages/Data/EditForms/EditGraphicCardType';
import EditLaptopType from './Pages/Data/EditForms/EditLaptopType';
import EditScreenSize from './Pages/Data/EditForms/EditScreenSize';
import EditPorts from './Pages/Data/EditForms/EditPorts';
import EditProcessor from './Pages/Data/EditForms/EditProcessor';
import EditRam from './Pages/Data/EditForms/EditRam';
import EditRamType from './Pages/Data/EditForms/EditRamType';
import EditRefreshRate from './Pages/Data/EditForms/EditRefreshRate';
import EditResolution from './Pages/Data/EditForms/EditResolution';
import EditScreenType from './Pages/Data/EditForms/EditScreenType';
import EditSpeaker from './Pages/Data/EditForms/EditSpeaker';
import EditStorage from './Pages/Data/EditForms/EditStorage';
import EditWebcam from './Pages/Data/EditForms/EditWebcam';
import Tabs from './Pages/Tabs/Tabs';
import AddLaptops from './Pages/Laptops/AddLaptops';
import AddMobiles from './Pages/Mobiles/AddMobiles';
import AddTabs from './Pages/Tabs/AddTabs';
import AddLEDs from './Pages/LEDs/AddLEDs';
import AddDesktopComputer from './Pages/DesktopComputers/AddDesktopComputers';
import AddAccessories from './Pages/Accessories/AddAccessories';
import EditLaptops from './Pages/Laptops/EditLaptops';
import EditTabs from './Pages/Tabs/EditTabs';
import EditMobiles from './Pages/Mobiles/EditMobiles';
import EditAccessories from './Pages/Accessories/EditAccessories';
import EditLEDs from './Pages/LEDs/EditLEDs';
import EditDesktopComputers from './Pages/DesktopComputers/EditDesktopComputers';
import Home from './Pages/Home';

const RedirectComponent = () => {

    const location = useLocation();
    
    const token = Cookies.get('accessToken');
    const dispatch = useDispatch()
    const refreshToken = localStorage.getItem('refreshToken')
    useLayoutEffect(()=> {
        if(token) {
            dispatch(currentUser(refreshToken));
        }else {
            dispatch(authActions.logout())
          }
    },[dispatch, refreshToken, token,location]);

    const { user } = useSelector((state)=> state.auth);

    return ( <>
    <Routes>
    {
        user && token?
        (
            <Route path='*' element={
                <Routes>
                    <Route path='/' element={<DashboardLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='laptops' element={<Outlet />}>
                            <Route exact path='' element={<Laptops />} />
                            <Route exact path='add' element={<AddLaptops />} />
                            <Route exact path='edit/:id' element={<EditLaptops />} /> 
                        </Route>
                        <Route path='mobiles' element={<Outlet />}>
                            <Route exact path='' element={<Mobiles />} />
                            <Route exact path='add' element={<AddMobiles />} />
                            <Route exact path='edit/:id' element={<EditMobiles />} />
                        </Route>
                        <Route path='tabs' element={<Outlet />}>
                            <Route exact path='' element={<Tabs />} />
                            <Route exact path='add' element={<AddTabs />} />
                            <Route exact path='edit/:id' element={<EditTabs />} />
                        </Route>
                        <Route path='leds' element={<Outlet />}>
                            <Route exact path='' element={<LEDs />} />
                            <Route exact path='add' element={<AddLEDs />} />
                            <Route exact path='edit/:id' element={<EditLEDs />} />
                        </Route>
                        <Route path='desktop-computers' element={<Outlet />}>
                            <Route exact path='' element={<DesktopComputers />} />
                            <Route exact path='add' element={<AddDesktopComputer />} />
                            <Route exact path='edit/:id' element={<EditDesktopComputers />} />
                        </Route>
                        <Route path='accessories' element={<Outlet />}>
                            <Route exact path='' element={<Accessories />} />
                            <Route exact path='add' element={<AddAccessories />} />
                            <Route exact path='edit/:id' element={<EditAccessories />} />
                        </Route>
                        <Route path='data' element={<Outlet />}>
                            <Route path='accessory-type' element={<Outlet />}>
                                <Route exact path='' element={<AccesoryType />} />
                                <Route exact path='add' element={<AddAccesoryType />} />
                                <Route exact path='edit/:id' element={<EditAccesoryType />} />
                            </Route>
                            <Route path='brand' element={<Outlet />}>
                                <Route exact path='' element={<Brand />} />
                                <Route exact path='add' element={<AddBrand />} />
                                <Route exact path='edit/:id' element={<EditBrand />} />
                            </Route>
                            <Route path='categories' element={<Outlet />}>
                                <Route exact path='' element={<Categories />} />
                                <Route exact path='add' element={<AddCategories />} />
                                <Route exact path='edit/:id' element={<EditCategories />} />
                            </Route>
                            <Route path='color' element={<Outlet />}>
                                <Route exact path='' element={<Color />} />
                                <Route exact path='add' element={<AddColor />} />
                                <Route exact path='edit/:id' element={<EditColor />} />
                            </Route>
                            <Route path='condition' element={<Outlet />}>
                                <Route exact path='' element={<Condition />} />
                                <Route exact path='add' element={<AddCondition />} />
                                <Route exact path='edit/:id' element={<EditCondition />} />
                            </Route>
                            <Route path='desktop-type' element={<Outlet />}>
                                <Route exact path='' element={<DesktopType />} />
                                <Route exact path='add' element={<AddDesktopType />} />
                                <Route exact path='edit/:id' element={<EditDesktopType />} />
                            </Route>
                            <Route path='generation' element={<Outlet />}>
                                <Route exact path='' element={<Generation />} />
                                <Route exact path='add' element={<AddGeneration />} />
                                <Route exact path='edit/:id' element={<EditGeneration />} />
                            </Route>
                            <Route path='graphic-card-specs' element={<Outlet />}>
                                <Route exact path='' element={<GraphicCardSpecs />} />
                                <Route exact path='add' element={<AddGraphicCardSpecs />} />
                                <Route exact path='edit/:id' element={<EditGraphicCardSpecs />} />
                            </Route>
                            <Route path='graphic-card-type' element={<Outlet />}>
                                <Route exact path='' element={<GraphicCardType />} />
                                <Route exact path='add' element={<AddGraphicCardType />} />
                                <Route exact path='edit/:id' element={<EditGraphicCardType />} />
                            </Route>
                            <Route path='laptop-type' element={<Outlet />}>
                                <Route exact path='' element={<LaptopType />} />
                                <Route exact path='add' element={<AddLaptopType />} />
                                <Route exact path='edit/:id' element={<EditLaptopType />} />
                            </Route>
                            <Route path='screen-size' element={<Outlet />}>
                                <Route exact path='' element={<ScreenSize />} />
                                <Route exact path='add' element={<AddScreenSize />} />
                                <Route exact path='edit/:id' element={<EditScreenSize />} />
                            </Route>
                            <Route path='ports' element={<Outlet />}>
                                <Route exact path='' element={<Ports />} />
                                <Route exact path='add' element={<AddPorts />} />
                                <Route exact path='edit/:id' element={<EditPorts />} />
                            </Route>
                            <Route path='processor' element={<Outlet />}>
                                <Route exact path='' element={<Processor />} />
                                <Route exact path='add' element={<AddProcessor />} />
                                <Route exact path='edit/:id' element={<EditProcessor />} />
                            </Route>
                            <Route path='ram' element={<Outlet />}>
                                <Route exact path='' element={<Ram />} />
                                <Route exact path='add' element={<AddRam />} />
                                <Route exact path='edit/:id' element={<EditRam />} />
                            </Route>
                            <Route path='ram-type' element={<Outlet />}>
                                <Route exact path='' element={<RamType />} />
                                <Route exact path='add' element={<AddRamType />} />
                                <Route exact path='edit/:id' element={<EditRamType />} />
                            </Route>
                            <Route path='refresh-rate' element={<Outlet />}>
                                <Route exact path='' element={<RefreshRate />} />
                                <Route exact path='add' element={<AddRefreshRate />} />
                                <Route exact path='edit/:id' element={<EditRefreshRate />} />
                            </Route>
                            <Route path='resolution' element={<Outlet />}>
                                <Route exact path='' element={<Resolution />} />
                                <Route exact path='add' element={<AddResolution />} />
                                <Route exact path='edit/:id' element={<EditResolution />} />
                            </Route>
                            <Route path='screen-type' element={<Outlet />}>
                                <Route exact path='' element={<ScreenType />} />
                                <Route exact path='add' element={<AddScreenType />} />
                                <Route exact path='edit/:id' element={<EditScreenType />} />
                            </Route>
                            <Route path='speaker' element={<Outlet />}>
                                <Route exact path='' element={<Speaker />} />
                                <Route exact path='add' element={<AddSpeaker />} />
                                <Route exact path='edit/:id' element={<EditSpeaker />} />
                            </Route>
                            <Route path='storage' element={<Outlet />}>
                                <Route exact path='' element={<Storage />} />
                                <Route exact path='add' element={<AddStorage />} />
                                <Route exact path='edit/:id' element={<EditStorage />} />
                            </Route>
                            <Route path='webcam' element={<Outlet />}>
                                <Route exact path='' element={<Webcam />} />
                                <Route exact path='add' element={<AddWebcam />} />
                                <Route exact path='edit/:id' element={<EditWebcam />} />
                            </Route>
                        </Route>
                        <Route exact path='/login' element={<Navigate to='/' />} />
                        <Route exact path='*' element={<Navigate to='/' />} />
                    </Route> 
                </Routes>
            }/> 
        ):(
            <Route path='*' element={
                <Routes>
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='*' element={token?<Outlet />:refreshToken?<Navigate to='/login' />:<Navigate to='/login' />} />
                </Routes>
            } />
            
        )
    }
    </Routes>
    </> );
}
 
export default RedirectComponent;
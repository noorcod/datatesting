import React from 'react'
import style from './../../styles/Sidebar.module.css';
import profile from './../../assets/images/profile.png';
import SideNavData from './SideNavData';
import SideNavLink from './SideNavLink';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../Features/authSlice';
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faClose } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSandwichOpen, toggle }) => {

    const nevigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const logout = () => {
        dispatch(authActions.logout())
        localStorage.removeItem('refreshToken')
        Cookies.remove('accessToken')
        nevigate('/login')
    }
    return (
        <div className={`bg-white shadowMain ${style.sidebar} ${!isSandwichOpen ? '' : style.sandwichOpen}`}>
            <div 
            className={`${isSandwichOpen ? 'justify-content-xl-center' : '' } py-3 px-2 ${style.infoDiv} `}
            >
                <div className={`${style.userInfo}`}>
                    <div className='ms-2 me-2'>
                        <img width='42px' height='42px' className='rounded-circle' src={profile} alt="profile" />
                    </div>
                    {!isSandwichOpen &&
                        <div>
                            <p className='fw-bold mb-0 text-capitalize'>{user && user.user_full_name}</p>
                            <span className='fw-light text-capitalize'>{user && user.user_type}</span>
                        </div>
                    }
                </div>
                <div role="button" className='text-white d-md-block d-lg-none' onClick={()=>toggle()}>
                    Close <FontAwesomeIcon icon={faClose} />
                </div>
            </div>
            <div className={`pt-4 d-flex flex-column justify-content-between ${isSandwichOpen ? 'align-items-center' : 'align-items-start'} ${style.sidebarItems}`}>
                <div className='w-100'
                style={{overflow:'auto',height:'calc(100vh - 25vh)'}}
                >
                    {SideNavData.map((item, index) => {
                        return <SideNavLink item={item} key={index} isSandwichOpen={isSandwichOpen} />
                    })}
                </div>
                <div className={`${isSandwichOpen ? '' : 'ps-3'}`}
                >
                    <span className={`${style.signOut}`} onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} /> {isSandwichOpen ? "" : "Sign Out"}</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
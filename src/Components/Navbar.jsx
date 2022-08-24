import React from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar } from 'react-bootstrap';
import logo from './../assets/images/logo2.png'
import logo2 from './../assets/images/logo3.png'
import style from './../styles/Navbar.module.css'
import { Link } from 'react-router-dom';

const Topbar = ({toggle,isSandwichOpen}) => {
    
    return ( 
        <Navbar className='shadowMain position-fixed w-100 mb-5' bg="white">
            <div className={`py-2 px-4 d-flex justify-content-center align-items-center gap-5 ${style.navItem}`}>
                <Link to='/'>
                    <div>
                        
                            <img src={logo2} className="me-2" alt='logo' />
                        
                        
                        {!isSandwichOpen &&
                            <img src={logo} className="me-4" alt='logo' />
                        }
                    </div>
                </Link>
                <div style={{width: '25px'}}>
                    <FontAwesomeIcon role="button" icon={faBars} onClick={()=>toggle()} />
                </div>
            </div>
        </Navbar>
     );
}
 
export default Topbar;
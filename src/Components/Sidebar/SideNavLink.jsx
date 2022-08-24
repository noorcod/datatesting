import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import style from './../../styles/Sidebar.module.css';

const SideNavLink = ({ item, isSandwichOpen }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav)
  return (
    <>
      {item.subNav ?
        <div className={`${style.Sidebartooltip}`}>
          <div className={` ${style.sideLink} d-block`} onClick={()=> {(showSubnav())}}>
            <div className={` ${!isSandwichOpen ? '' : 'text-center'} d-flex ${isSandwichOpen ? 'justify-content-center' : 'justify-content-between'} align-items-center`}>
            <NavLink style={({ isActive }) =>
              isActive
                ? {
                  color: '#774CED',
                  textDecoration: 'none'
                }
                : { color: '#545e6f', textDecoration: 'none' }
            }

              className={`d-block`} to={item.path}>
              <div>{item.icon} {isSandwichOpen ? "" : item.title}</div>
              </NavLink>
              <div className='text-secondary'>
                {item.subNav && subnav
                  ? isSandwichOpen ? "" : item.iconOpen
                  : item.subNav
                    ? isSandwichOpen ? "" : item.iconClose
                    : null}
              </div>
            </div>
            <span className={`${isSandwichOpen ? style.tooltipClose : 'd-none'}`}>{item.title}</span>
          </div>
        </div>
        :
        (<>

          <div className={`${style.Sidebartooltip}`}>
            <NavLink style={({ isActive }) =>
              isActive
                ? {
                  color: '#774CED',
                  background: '#F1F4FA',
                }
                : { color: '#545e6f' }
            }

              className={` ${style.sideLink} d-block`} to={item.path}>


              <div className={` ${!isSandwichOpen ? '' : 'text-center'} d-flex ${isSandwichOpen ? 'justify-content-center' : 'justify-content-between'} align-items-center`}>
                <div>{item.icon} {isSandwichOpen ? "" : item.title}</div>
                <div className='text-secondary'>
                  {item.subNav && subnav
                    ? isSandwichOpen ? "" : item.iconOpen
                    : item.subNav
                      ? isSandwichOpen ? "" : item.iconClose
                      : null}
                </div>
              </div>
              <span className={`${isSandwichOpen ? style.tooltipClose : 'd-none'}`}>{item.title}</span>
            </NavLink>
          </div>
        </>)
      }
      {
        subnav &&
        item.subNav.map((item, index) => {
          return (
            <div className={`${isSandwichOpen ? 'ps-3' : 'ps-4'} mt-2`} key={index}>
              <div className={`${style.Sidebartooltip}`}>
                <NavLink style={({ isActive }) =>
                  isActive
                    ? {
                      color: '#774CED',
                      background: '#F1F4FA',
                    }
                    : { color: '#545e6f' }
                } className={`${style.submenu}`} to={item.path} >
                  <div className={`${style.submenuItem} d-flex align-items-center ${isSandwichOpen ? 'justify-content-center' : ''}`}>
                    <span className={` ${isSandwichOpen ? '' : 'me-2'}`}>{item.icon}</span> {isSandwichOpen ? "" : item.title}
                  </div>
                  <span className={`${isSandwichOpen ? style.tooltipClose : 'd-none'}`}>{item.title}</span>
                </NavLink>
              </div>
            </div>
          )
        })
      }
    </>

  );
}

export default SideNavLink;
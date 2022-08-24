import React from 'react';
import { Card } from 'react-bootstrap'
import style from './../styles/FormCard.module.css'
import logo from './../assets/images/logo.png'

const FormCard = (props) => {
    return ( 
        <Card className={`border-0 shadow-sm ${style.formCard}`}>
            <div className='text-center'>
                <img src={logo} alt="" />
            </div>
            {props.children}
        </Card>
     );
}
 
export default FormCard;
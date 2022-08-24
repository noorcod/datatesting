import React,{useEffect,useState} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';
import AddForm from '../../../Components/AddForm';
import validationStyle from '../../../styles/validationLabel.module.css';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';

const AddPorts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [validated,setValidated] = useState(false);
    const [checked,setChecked] = useState(false);

    const [label,setLabel] = useState("");
    const [mobile,setMobile] = useState(false);
    const [tab,setTab] = useState(false);
    const [laptop,setLaptop] = useState(false);
    const [desktop,setDesktop] = useState(false);
    const [led,setLed] = useState(false);

    const [submiting,setSubmiting] = useState(false);
    const [submited,setSubmited] = useState(false);
    const [failed,setFailed] = useState(false);
    
    const [labelError,setLabelError] = useState(false);

    const labelHandle = (e) =>{
        if(e.target.value.length > 60){
            setLabelError(true);
        }else{
            setLabelError(false);
            setLabel(e.target.value);
        }
    }

    useEffect(()=>{
        
        if(location.state.category.is_mobile){
            setMobile(true);
        }
        if(location.state.category.is_tab){
            setTab(true);
        }
        if(location.state.category.is_laptop){
            setLaptop(true);
        }
        if(location.state.category.is_desktop){
            setDesktop(true);
        }
        if(location.state.category.is_led){
            setLed(true);
        }
    },[location])
    
    useEffect(()=>{
        if(mobile || tab || laptop || desktop || led){
            setChecked(true)
        }else{
            setChecked(false)
        }
    },[mobile,tab,laptop,desktop,led])

    const submitForm =(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity()===false){
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true)
        if(label.trim().length > 0){
            setSubmiting(true);
            axios.post(process.env.REACT_APP_URL_API_DATA+'/ports/add',
            {
                po_label:label,
                is_mobile:mobile,
                is_tab:tab,
                is_laptop:laptop,
                is_desktop:desktop,
                is_led:led,
            },{ withCredentials: true}
            ).then((res)=>{
                setSubmited(true);
                setTimeout(()=>{
                    setSubmiting(false);
                    setSubmited(false);
                    navigate('/data/ports?page='+location.state.page+'&category='+Object.keys(location.state.category)[0].split('_')[1]);
                },2000)
            }).catch(()=>{
                setFailed(true);
                setTimeout(()=>{
                    setSubmiting(false);
                    setFailed(false);
                },2000)
            })
        }
        
    }


    return ( <>
        <SubmitWaiting submiting={submiting} submited={submited} failed={failed}/>
        <AddForm>
        <div className='d-flex justify-content-start'>
            <button class="backFormButton" onClick={()=>navigate(-1)}><span>Back</span></button>
        </div>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Add Ports</h2>
        </div>
        <Form noValidate validated={validated}  onSubmit={submitForm}>
            <Form.Group className='mb-3' controlId='label'>
                <Form.Label className='asterik-label'>Label:</Form.Label>
                <Form.Control type='text' placeholder='Enter Ports' value={label} onChange={labelHandle} required/>
                <Form.Control.Feedback type='invalid'>Please Enter Label.</Form.Control.Feedback>
                {
                    labelError &&
                    <span style={{color:'red'}}>*Label Must be less than 60 characters.</span>
                }
            </Form.Group>
            <Row>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='mobile'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={mobile}
                        id='mobiile'
                        label='Mobile'
                        onClick={(e)=>{setMobile(prev=>!prev)}}
                    />
                </Form.Group>     
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='tab'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={tab}
                        id='tab'
                        label='Tab'
                        onClick={(e)=>{setTab(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='desktop-computer'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={desktop}
                        id='desktop-computer'
                        label='Desktop Computer'
                        onClick={(e)=>{setDesktop(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='laptop'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={laptop}
                        id='laptop'
                        label='Laptop'
                        onClick={(e)=>{setLaptop(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='led'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={led}
                        id='led'
                        label='LED'
                        onClick={(e)=>{setLed(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        className='mb-3 d-flex'
                        checked={checked}
                        required
                        hidden
                        feedback="Please checked atleast one device."
                        feedbackType='invalid'
                    />
                </Form.Group>
            </Row>
            <Form.Group>
                <Form.Control type='button' value='Add' onClick={submitForm} className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default AddPorts;
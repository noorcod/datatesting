import React,{useEffect,useState} from 'react'
import { useParams, useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form } from 'react-bootstrap';
import validationStyle from '../../../styles/validationLabel.module.css';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';
import AddForm from '../../../Components/AddForm';

const EditBrand = () => {

    const {id} = useParams();
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
    const [accessory,setAccessory] = useState(false);
   
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
        axios.get(process.env.REACT_APP_URL_API_DATA+'/brand/get/'+id).then((res)=>{
            setLabel(res.data.brand)
            setMobile(res.data.mobile === 1)
            setTab(res.data.tab === 1)
            setLaptop(res.data.laptop === 1)
            setDesktop(res.data.desktop === 1)
            setLed(res.data.led === 1)
            setAccessory(res.data.accessory === 1)
        })
    },[id])

    useEffect(()=>{
        if(mobile || tab || laptop || desktop || led || accessory){
            setChecked(true)
        }else{
            setChecked(false)
        }
    },[mobile,tab,laptop,desktop,led,accessory])

    const submitForm =(e)=>{
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.preventDefault();
            e.stopPropogation();
        }

        setValidated(true);
        if(checked){
            if(label.trim().length > 0){
                setSubmiting(true);
                const obj = {
                    brand_id:id,
                    brand_name:label,
                    is_mobile:mobile,
                    is_tab:tab,
                    is_laptop:laptop,
                    is_desktop:desktop,
                    is_led:led,
                    is_accessory:accessory
                }
                axios.patch(process.env.REACT_APP_URL_API_DATA+'/brand/update',obj,{withCredentials:true}).then((res)=>{
                    setSubmited(true);
                    setTimeout(()=>{
                        setSubmiting(false);
                        setSubmited(false);
                        navigate('/data/brand?page='+location.state.page+'&category='+Object.keys(location.state.category)[0].split('_')[1]);
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
        
        
    }


    return ( <>
        <SubmitWaiting submiting={submiting} submited={submited} failed={failed}/>
        <AddForm>
        <div className='d-flex justify-content-start'>
            <button class="backFormButton" onClick={()=>navigate(-1)}><span>Back</span></button>
        </div>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Edit Brand</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
            <Form.Group className='mb-3' controlId='label'>
                <Form.Label className='asterik-label'>Brand Name:</Form.Label>
                <Form.Control type='text' placeholder='Enter Brand Name' value={label} onChange={labelHandle} required/>
                <Form.Control.Feedback type='invalid'>Please Enter Label.</Form.Control.Feedback>
                {
                    labelError &&
                    <span style={{color:'red'}}>*Label Must be less than 60 characters.</span>
                }
            </Form.Group>
            <Row>
                <Form.Group as={Col} sm ="12" md="6" lg="6" className={`mb-3 d-flex`} controlId='mobile'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={mobile}
                        id='mobiile'
                        label='Mobile'
                        onChange={(e)=>{setMobile(prev=> !prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6" className='mb-3 d-flex' controlId='tab'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={tab}
                        id='tab'
                        label='Tab'
                        onChange={(e)=>{setTab(prev=> !prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col}  sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='desktop-computer'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={desktop}
                        id='desktop-computer'
                        label='Desktop Computer'
                        onChange={(e)=>{setDesktop(prev=> !prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col}  sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='laptop'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={laptop}
                        id='laptop'
                        label='Laptop'
                        onChange={(e)=>{setLaptop(prev=> !prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col}  sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='accessories'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={accessory}
                        id='acessories'
                        label='Accessories'
                        onChange={(e)=>{setAccessory(prev=> !prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col}  sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='led'>
                    <Form.Check
                        className={validationStyle.thisLabel}
                        checked={led}
                        id='led'
                        label='LED'
                        onChange={(e)=>{setLed(prev=> !prev)}}
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
                <Form.Control type='button' value='Update' onClick={submitForm} className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default EditBrand;
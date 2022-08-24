import React,{useEffect,useState} from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form } from 'react-bootstrap';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';
import AddForm from '../../../Components/AddForm';

const EditRam = () => {

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
    const [submiting,setSubmiting] = useState(false);
    const [submited,setSubmited] = useState(false);
    const [failed,setFailed] = useState(false);
    
    const [labelError,setLabelError] = useState(false);

    const labelHandle = (e) =>{
        if(e.target.value.length > 10){
            setLabelError(true);
        }else{
            setLabelError(false);
            setLabel(e.target.value);
        }
    }

    useEffect(()=>{
        if(mobile || tab || laptop || desktop){
            setChecked(true)
        }else{
            setChecked(false)
        }
    },[mobile,tab,laptop,desktop])

   
    useEffect(()=>{
        axios.get(process.env.REACT_APP_URL_API_DATA+'/ram/get/'+id).then((res)=>{
            setLabel(res.data.ram.toString())
            setMobile(res.data.mobile === 1)
            setTab(res.data.tab === 1)
            setLaptop(res.data.laptop === 1)
            setDesktop(res.data.desktop === 1)
        })
    },[id])

    const submitForm =(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity()===false){
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
        if(checked){
            if(label.trim().length > 0){
                setSubmiting(true);
                const obj ={
                    ram_id:id,
                    ram_in_gb:label,
                    is_mobile:mobile,
                    is_tab:tab,
                    is_laptop:laptop,
                    is_desktop:desktop,
                }
                axios.patch(process.env.REACT_APP_URL_API_DATA+'/ram/update',
                obj,{ withCredentials: true}
                ).then((res)=>{
                    setSubmited(true);
                    setTimeout(()=>{
                        setSubmiting(false);
                        setSubmited(false);
                        navigate('/data/ram?page='+location.state.page+'&category='+Object.keys(location.state.category)[0].split('_')[1]);
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
             <h2 className='text-secondary'>Edit RAM</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
            <Form.Group className='mb-3' controlId='label'>
                <Form.Label className='asterik-label'>RAM Size(in GB):</Form.Label>
                <Form.Control type='number' placeholder='Enter RAM Size (i.e. 8)' value={label} onChange={labelHandle} required/>
                <Form.Control.Feedback type='invalid'>Please Enter Label.</Form.Control.Feedback>
                {
                    labelError &&
                    <span style={{color:'red'}}>*RAM Must be less than 10 digits.</span>
                }
            </Form.Group>
            <Row>
                <Form.Group className='mb-3 d-flex' controlId='mobile'>
                    <Form.Check
                        checked={mobile}
                        id='mobiile'
                        label='Mobile'
                        onChange={(e)=>{setMobile(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group className='mb-3 d-flex' controlId='tab'>
                    <Form.Check
                        checked={tab}
                        id='tab'
                        label='Tab'
                        onChange={(e)=>{setTab(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group className='mb-3 d-flex' controlId='desktop-computer'>
                    <Form.Check
                        checked={desktop}
                        id='desktop-computer'
                        label='Desktop Computer'
                        onChange={(e)=>{setDesktop(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group className='mb-3 d-flex' controlId='laptop'>
                    <Form.Check
                        checked={laptop}
                        id='laptop'
                        label='Laptop'
                        onChange={(e)=>{setLaptop(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        className='mb-3 d-flex'
                        checked={checked}
                        required
                        hidden
                        feedback="Please check atleast one device."
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
 
export default EditRam;
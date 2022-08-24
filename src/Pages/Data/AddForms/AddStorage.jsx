import React,{useEffect,useState} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form } from 'react-bootstrap';
import validationStyle from '../../../styles/validationLabel.module.css';
import AddForm from '../../../Components/AddForm';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';

const AddStorage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const [validated,setValidated] = useState(false);
    const [checkedDevice,setCheckedDevice] = useState(false);
    const [checkedStorage,setCheckedStorage] = useState(false);

    const [label,setLabel] = useState("");

    const [ssd,setSsd] = useState(false);
    const [hdd,setHdd] = useState(false);

    const [isMobile,setIsMobile] = useState(false);

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
        if(location.state.category.is_mobile || location.state.category.is_tab){
            setIsMobile(true);
        }
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
        if(location.state.type.is_ssd){
            setSsd(true);
        }else
        if(location.state.type.is_hdd){
            setHdd(true);
        }else
        {
            setSsd(true);
            setHdd(true);
        }
    },[location])

    useEffect(()=>{
        if(mobile || tab || laptop || desktop){
            setCheckedDevice(true)
        }else{
            setCheckedDevice(false)
        }
    },[mobile,tab,laptop,desktop])

    useEffect(()=>{
        if(ssd || hdd){
            setCheckedStorage(true)
        }else{
            setCheckedStorage(false)
        }
    },[ssd, hdd])


    const submitForm =async(e)=>{
        try{
            e.preventDefault();
            const form = e.currentTarget;
            if(form.checkValidity()===false){
                e.preventDefault();
                e.stopPropagation();
            }
            setValidated(true);
            let res;
            if(checkedDevice){
                if(label.trim().length > 0){
                    if(isMobile){
                        setSubmiting(true);
                        res = await axios.post(process.env.REACT_APP_URL_API_DATA+'/mobile-storage/add',
                        {
                            storage_in_gb:label,
                            is_mobile:mobile,
                            is_tab:tab
                        },{ withCredentials: true}
                        );
                    }else{
                        if(checkedStorage){
                            setSubmiting(true);
                            res = await axios.post(process.env.REACT_APP_URL_API_DATA+'/storage/add',
                            {
                                storage_in_gb:label,
                                is_laptop:laptop,
                                is_desktop:desktop,
                                is_ssd:ssd,
                                is_hdd:hdd
                            },{ withCredentials: true}
                            );
                        }
                    }
                    if(res){
                        setSubmited(true);
                        setTimeout(()=>{
                            setSubmiting(false);
                            setSubmited(false);
                            if(isMobile){
                                navigate('/data/storage?page='+location.state.page+'&category='+Object.keys(location.state.category)[0].split('_')[1]);
                            }else{
                                navigate('/data/storage?page='+location.state.page+'&category='+Object.keys(location.state.category)[0].split('_')[1]+'&type='+Object.keys(location.state.type)[0]?.split('_')[1]);
                            }
                        },2000)
                    }
                }
            }
        }catch(err){
            setFailed(true);
            setTimeout(()=>{
                setSubmiting(false);
                setFailed(false);
            },2000)
        }
        
        
    }


    return ( <>
        <SubmitWaiting submiting={submiting} submited={submited} failed={failed} />
        <AddForm>
        <div className='d-flex justify-content-start'>
            <button class="backFormButton" onClick={()=>navigate(-1)}><span>Back</span></button>
        </div>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Add Storage</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
            <Form.Group className='mb-3' controlId='label'>
                <Form.Label className='asterik-label'>Storage(in GB):</Form.Label>
                <Form.Control type='number' placeholder='Enter Storage (i.e. 1024)' value={label} onChange={labelHandle} required/>
                <Form.Control.Feedback type='invalid'>Please Enter Size of Storage.</Form.Control.Feedback>
                {
                    labelError &&
                    <span style={{color:'red'}}>*Storage Must be less than 10 digits.</span>
                }
            </Form.Group>
                <Row>
                {
                    isMobile &&
                    <>
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
                    </>
                }
                {
                    !isMobile &&
                    <>
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
                    </>
                    }
                <Form.Group>
                    <Form.Check
                        className='mb-3 d-flex'
                        checked={checkedDevice}
                        required
                        hidden
                        feedback="Please check atleast one device."
                        feedbackType='invalid'
                    />
                </Form.Group>
            </Row>
            {
                !isMobile &&
                <>
                <hr className='row border-bottom border-primar' />
                <Row>
                    <Form.Group  as={Col} sm ="12" md="6" lg="6"className='mb-3 d-flex' controlId='ssd'>
                        <Form.Check
                            className={validationStyle.thisLabel}
                            checked={ssd}
                            id='ssd'
                            label='SSD'
                            onClick={(e)=>{setSsd(prev=>!prev)}}
                        />
                    </Form.Group>
                    <Form.Group  as={Col} sm ="12" md="6" lg="6"className='mb-3 d-flex' controlId='hdd'>
                        <Form.Check
                            className={validationStyle.thisLabel}
                            checked={hdd}
                            id='hdd'
                            label='HDD'
                            onClick={(e)=>{setHdd(prev=>!prev)}}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            className='mb-3 d-flex'
                            checked={checkedStorage}
                            required
                            hidden
                            feedback="Please check atleast one Storage type."
                            feedbackType='invalid'
                        />
                    </Form.Group>
                </Row>
                </>
                }
            <Form.Group>
                <Form.Control type='button' value='Add' onClick={submitForm} className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default AddStorage;
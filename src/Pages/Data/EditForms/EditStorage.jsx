import React,{useEffect,useState} from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form } from 'react-bootstrap';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';
import AddForm from '../../../Components/AddForm';

const EditStorage = () => {

    const {id} = useParams();
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
        if(isMobile){
            axios.get(process.env.REACT_APP_URL_API_DATA+'/mobile-storage/get/'+id).then((res)=>{
                setLabel(res.data.storage.toString())
                setMobile(res.data.mobile === 1)
                setTab(res.data.tab === 1)
            })
        }else{
            axios.get(process.env.REACT_APP_URL_API_DATA+'/storage/get/'+id).then((res)=>{
                setLabel(res.data.storage.toString())
                setLaptop(res.data.laptop === 1)
                setDesktop(res.data.desktop === 1)
                setSsd(res.data.ssd === 1)
                setHdd(res.data.hdd === 1)
            })
        }
        
    },[id,isMobile])
    
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


    const submitForm = async(e)=>{
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
                        const obj ={
                            storage_id:id,
                            storage_in_gb:label,
                            is_mobile:mobile,
                            is_tab:tab
                        }
                        res = await axios.patch(process.env.REACT_APP_URL_API_DATA+'/mobile-storage/update',
                        obj
                        );
                        
                    }else{
                        if(checkedStorage){ 
                            setSubmiting(true);
                            const obj ={
                                storage_id:id,
                                storage_in_gb:label,
                                is_laptop:laptop,
                                is_desktop:desktop,
                                is_ssd:ssd,
                                is_hdd:hdd
                            }
                            res = await axios.patch(process.env.REACT_APP_URL_API_DATA+'/storage/update',
                            obj,{ withCredentials: true}
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
        <SubmitWaiting submiting={submiting} submited={submited} failed={failed}/>
        <AddForm>
        <div className='d-flex justify-content-start'>
            <button class="backFormButton" onClick={()=>navigate(-1)}><span>Back</span></button>
        </div>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Edit Storage</h2>
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
                        checked={mobile}
                        id='mobiile'
                        label='Mobile'
                        onChange={(e)=>{setMobile(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='tab'>
                    <Form.Check
                        checked={tab}
                        id='tab'
                        label='Tab'
                        onChange={(e)=>{setTab(prev=>!prev)}}
                    />
                </Form.Group>
                </>}
                {
                !isMobile &&
                <>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='desktop-computer'>
                    <Form.Check
                        checked={desktop}
                        id='desktop-computer'
                        label='Desktop Computer'
                        onChange={(e)=>{setDesktop(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='laptop'>
                    <Form.Check
                        checked={laptop}
                        id='laptop'
                        label='Laptop'
                        onChange={(e)=>{setLaptop(prev=>!prev)}}
                    />
                </Form.Group>
                </>}
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
                {
                !isMobile &&
                <>
                <hr as={Col} className='row border-bottom border-primar' />
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='ssd'>
                    <Form.Check
                        checked={ssd}
                        id='ssd'
                        label='SSD'
                        onChange={(e)=>{setSsd(prev=>!prev)}}
                    />
                </Form.Group>
                <Form.Group as={Col} sm ="12" md="6" lg="6"  className='mb-3 d-flex' controlId='hdd'>
                    <Form.Check
                        checked={hdd}
                        id='hdd'
                        label='HDD'
                        onChange={(e)=>{setHdd(prev=>!prev)}}
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
                </>}
            </Row>
            <Form.Group>
                <Form.Control type='button' value='Update' onClick={submitForm} className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default EditStorage;
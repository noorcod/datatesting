import React,{useEffect,useState} from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import SubmitWaiting from '../../../Components/SubmitWaiting/SubmitWaiting';
import AddForm from '../../../Components/AddForm';

const EditGraphicCardSpecs = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [validated,setValidated] = useState(false);

    const [label,setLabel] = useState("");
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
        axios.get(process.env.REACT_APP_URL_API_DATA+'/graphic-card-specs/get/'+id).then((res)=>{
            setLabel(res.data.label)
        })
    },[id])

    const submitForm =(e)=>{
        const form = e.currentTarget;
        if(form.checkValidity()===false){
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
        if(label.trim().length > 0){
            setSubmiting(true);
            const obj = {
                gcs_id:id,
                gcs_label:label
            }
            axios.patch(process.env.REACT_APP_URL_API_DATA+'/graphic-card-specs/update',obj,{ withCredentials: true}).then((res)=>{
                setSubmited(true);
                setTimeout(()=>{
                    setSubmiting(false);
                    setSubmited(false);
                    navigate('/data/graphic-card-specs?page='+location.state.page);
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
             <h2 className='text-secondary'>Edit Graphic Card Specs</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
            <Form.Group className='mb-3' controlId='label'>
                <Form.Label className='asterik-label'>Graphic Card Specs:</Form.Label>
                <Form.Control type='text' placeholder='Enter Graphic Card Specs' value={label} onChange={labelHandle} required/>
                <Form.Control.Feedback type='invalid'>Please Enter Label.</Form.Control.Feedback>
                {
                    labelError &&
                    <span style={{color:'red'}}>*Label Must be less than 60 characters.</span>
                }
            </Form.Group>
            <Form.Group>
                <Form.Control type='button' value='Update' onClick={submitForm} className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default EditGraphicCardSpecs;
import React,{useEffect,useState,useRef} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Markdown from '../../Components/Markdown/Markdown';
import AddForm from '../../Components/AddForm';
import ImageUploader from '../../Components/ImageUploader/ImageUploader';
import SubmitWaiting from '../../Components/SubmitWaiting/SubmitWaiting';

const AddMobiles = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [validated,setValidated] = useState(false);
    
    const [filterInput,setFilterInput] = useState("");

    const [title,setTitle] = useState("");
    const [modelName,setModelName] = useState("");
    const [brand,setBrand] = useState("");
    const [color,setColor] = useState([]);
    const [storage,setStorage] = useState("");
    const [screenType,setScreenType] = useState("");
    const [ram,setRam] = useState("");
    const [processor,setProcessor] = useState("");
    const [ports,setPorts] = useState("");
    const [speaker,setSpeaker] = useState("");
    const [screenSize,setScreenSize] = useState("");
    const [refreshRate,setRefreshRate] = useState("");
    const [resolution,setResolution] = useState("");
    const [description,setDescription] = useState("");
    const [images,setImages] = useState([]);


    const imageComponent = useRef();
 
    const [submiting,setSubmiting] = useState(false);
    const [submited,setSubmited] = useState(false);
    const [failed,setFailed] = useState(false);
    
    useEffect(()=>{
        setTitle(`${brand?brand.label:""}-${modelName}-${ram?ram.label:""}/${storage?storage.label:""}`);
    },[modelName,brand,ram,storage])


    const submitForm =async (e)=>{
        try{
            e.preventDefault();
            const form = e.currentTarget;
            if(form.checkValidity()===false){
                e.preventDefault();
                e.stopPropagation();
            }
            setValidated(true);
            if((title.trim().length > 0) && (modelName.trim().length > 0) && (description.trim().length > 0) && (images.length > 0)){
                setSubmiting(true);
                const data = await imageComponent.current.uploadingImages();
                if(data){
                    const imageRes = await axios.post(process.env.REACT_APP_URL_API_DATA+'/images/add',{images:data},{withCredentials:true});
                    if(imageRes?.data){
                        const obj  = {
                            model_title: title,
                            model_name:modelName,
                            category_id:2,
                            category_name:'Mobile',
                            brand_id:brand.value,
                            brand_name:brand.label,
                            colors_available:color.map((obj)=>obj.value).join(","),
                            mobile_storage:storage.label.toString(),
                            mobile_storage_id:storage.value,
                            ram:ram.label.toString(),
                            ram_id:ram.value,
                            processor:processor.label,
                            p_id:processor.value,
                            screen_size:screenSize.label,
                            ss_id:screenSize.value,
                            ports:ports.label,
                            po_id:ports.value,
                            speaker:speaker.label,
                            sp_id:speaker.value,
                            screen_type:screenType.label,
                            st_id:screenType.value,
                            refresh_rate:refreshRate.label,
                            rr_id:refreshRate.value,
                            resolution:resolution.label,
                            rs_id:resolution.value,
                            description:description,
                            images:Number(imageRes.data.insertId)
                        }
                        const modelRes = await axios.post(process.env.REACT_APP_URL_API_DATA+'/model/add',obj,{withCredentials:true});
                        if(modelRes){
                            setSubmited(true);
                            setTimeout(()=>{
                                setSubmiting(false);
                                setSubmited(false);
                                navigate('/mobiles?page='+location.state.page);
                            },2000)
                        }
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
             <h2 className='text-secondary'>Add Mobiles</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
            <Row>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type='text' placeholder='Enter Title' value={title} onChange={(e)=>{setTitle(e.target.value)}} disabled={true} />
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Model Name:</Form.Label>
                    <Form.Control type='text' placeholder='Enter Model Name' value={modelName} onChange={(e)=>{setModelName(e.target.value)}} required/>
                    <Form.Control.Feedback type='invalid'>Please Enter Model name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Brand:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/brand/get`,{is_mobile:true})
                                .then(data=>{              
                                    const getData = data.data.map(({id,brand})=> ({ value: id, label: brand }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setBrand(e)
                        }}
                        value={brand}
                        
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={brand} required />
                    <Form.Control.Feedback type='invalid'>Please Select Brand.</Form.Control.Feedback>

                </Form.Group>

                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Colors:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/color/get`,{is_mobile:true})
                                .then(data=>{        
                                    const getData = data.data.map(({id,color})=> ({ value: color, label: color }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        closeMenuOnSelect={false}
                        onChange={(e)=>{
                            setColor(e)
                        }}
                        value={color}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={color} required />
                    <Form.Control.Feedback type='invalid'>Please Select Color.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Storage:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/mobile-storage/get`,{is_mobile:true})
                                .then(data=>{              
                                    const getData = data.data.map(({id,storage})=> ({ value: id, label: storage+"GB" }));
                                    const result = getData.filter((i)=>
                                        i.label.toString().toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setStorage(e)
                        }}
                        value={storage}
                        
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={storage} required />
                    <Form.Control.Feedback type='invalid'>Please Select Storage.</Form.Control.Feedback>
                    
                </Form.Group>

                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>RAM:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ram/get`,{is_mobile:true})
                                .then(data=>{        
                                    const getData = data.data.map(({id,ram})=> ({ value: id, label:ram+"GB" }));
                                    const result = getData.filter((i)=>
                                        i.label.toString().toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setRam(e)
                        }}
                        value={ram}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={ram} required />
                    <Form.Control.Feedback type='invalid'>Please Select RAM.</Form.Control.Feedback>
                    
                </Form.Group>

                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Processor:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/processor/get`,{is_mobile:true})
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setProcessor(e)
                        }}
                        value={processor}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={processor} required />
                    <Form.Control.Feedback type='invalid'>Please Select Processor.</Form.Control.Feedback>
                    
                </Form.Group>
  
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Ports:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ports/get`,{filters:{is_mobile:true}})
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setPorts(e)
                        }}
                        value={ports}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={ports} required />
                    <Form.Control.Feedback type='invalid'>Please Select Ports.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Speaker:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/speaker/get`)
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setSpeaker(e)
                        }}
                        value={speaker}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={speaker} required />
                    <Form.Control.Feedback type='invalid'>Please Select Speaker.</Form.Control.Feedback>
                    
                </Form.Group>


                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>resolution:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/resolution/get`)
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setResolution(e)
                        }}
                        value={resolution}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={resolution} required />
                    <Form.Control.Feedback type='invalid'>Please Select Resolution.</Form.Control.Feedback>
                    
                </Form.Group>
           
                
            
                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Refresh Rate:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/refresh-rate/get`)
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setRefreshRate(e)
                        }}
                        value={refreshRate}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={refreshRate} required />
                    <Form.Control.Feedback type='invalid'>Please Select Refresh Rate.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Screen Size:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/screen-size/get`)
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setScreenSize(e)
                        }}
                        value={screenSize}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={screenSize} required />
                    <Form.Control.Feedback type='invalid'>Please Select Screen Size.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Screen Type:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/screen-type/get`)
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: id, label }));
                                    const result = getData.filter((i)=>
                                        i.label.toLowerCase().includes(filterInput.toLowerCase())
                                    )
                                    resolve(result)
                                })
                                .catch(err=>{
                                    reject(err)
                                })
                            })
                        }}
                        onChange={(e)=>{
                            setScreenType(e)
                        }}
                        value={screenType}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    
                    <Form.Control hidden value={screenType} required />
                    <Form.Control.Feedback type='invalid'>Please Select Screen Type.</Form.Control.Feedback>
                    
                </Form.Group>
                
                <Form.Group as={Col} lg='12' md='12' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Description:</Form.Label>
                    <Markdown value={description} setValue={setDescription} placeholder='Enter Description (5,000 Characters)' />
                    <Form.Control hidden as='textarea' placeholder='Enter Description (5,000 Characters)' value={description} onChange={(e)=>{setDescription(e.target.value)}} maxLength={5000} required/>
                    <Form.Control.Feedback type='invalid'>Please Enter Description.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group  as={Col} lg='12' md='12' sm='12'>
                    <ImageUploader ref={imageComponent} selectedFiles={images} setSelectedFiles={setImages} />
                    <Form.Control hidden value={images.length > 0?images:null} required/>
                    <Form.Control.Feedback type='invalid'>Please Upload atleast One Image.</Form.Control.Feedback>
                </Form.Group>
            </Row>
            
            <Form.Group>
                <Form.Control type='button' value='Add' onClick={submitForm}  className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default AddMobiles;
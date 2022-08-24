import React,{useEffect,useState,useRef} from 'react'
import { useLocation,useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Markdown from '../../Components/Markdown/Markdown';
import AddForm from '../../Components/AddForm';
import EditImageUploader from '../../Components/ImageUploader/EditImageUploader';
import SubmitWaiting from '../../Components/SubmitWaiting/SubmitWaiting';

const EditLEDs = () => {

    const { id } = useParams();
    
    const location = useLocation();
    const navigate = useNavigate();

    const [validated,setValidated] = useState(false);
    
    const [filterInput,setFilterInput] = useState("");

    const [title,setTitle] = useState("");
    const [modelName,setModelName] = useState("");
    const [brand,setBrand] = useState("");
    const [color,setColor] = useState([]);
    const [screenType,setScreenType] = useState("");
    const [ports,setPorts] = useState([]);
    const [speaker,setSpeaker] = useState("");
    const [screenSize,setScreenSize] = useState("");
    const [refreshRate,setRefreshRate] = useState("");
    const [resolution,setResolution] = useState("");
    const [description,setDescription] = useState("");
    const [imageId,setImageId] = useState(-1);
    const [images,setImages] = useState([]);

    const ourRequest = axios.CancelToken;
    var cancel;
    const imageComponent = useRef();

    const [submiting,setSubmiting] = useState(false);
    const [submited,setSubmited] = useState(false);
    const [failed,setFailed] = useState(false);
 
    useEffect(()=>{
        axios.post(process.env.REACT_APP_URL_API_DATA+'/model/leds/'+id).then((res)=>{
                setTitle(res.data[0].title);
                setModelName(res.data[0].model_name);
                setBrand({ value: res.data[0].brand_id, label: res.data[0].brand_name });
                setColor(res.data[0].colors_available.split(",").map((color)=> ({value:color,label:color})))
                setPorts(res.data[0].ports.split(',').map(port=>({value:port,label:port})))
                setSpeaker({value:res.data[0].sp_id,label:res.data[0].speaker})
                setResolution({value:res.data[0].rs_id,label:res.data[0].resolution})
                setRefreshRate({value:res.data[0].rr_id,label:res.data[0].refresh_rate})
                setScreenSize({value:res.data[0].ss_id,label:res.data[0].screen_size})
                setScreenType({value:res.data[0].st_id,label:res.data[0].screen_type})
                setDescription(res.data[0].description)
                setImageId(res.data[0].images)
                if(images.length === 0){
                    axios.get(process.env.REACT_APP_URL_API_DATA+'/images/get/'+res.data[0].images,{cancelToken: new ourRequest((c)=>{cancel = c;})}).then(data=>{
                        cancel();
                        const retImage = data.data.map(async image=>{
                            const img = await axios.get(image)
                            const fileName = image.split('/').pop();
                            const ext = fileName.split('.')[1]
                            const file = new File([img],fileName,{type:'image/'+ext});
                            const obj = {
                                preview:image,
                                data:file,
                                type:'url'
                            }
                            return obj; 
                        })
                        Promise.all(retImage).then((img)=>{
                            setImages(img)
                        })
                    })
                }
            })
    },[id])

 
    useEffect(()=>{
        setTitle(`${brand?brand.label:""}-${modelName}-${screenSize?screenSize.label:""}-${refreshRate?refreshRate.label:""}`);
    },[modelName,brand,screenSize,refreshRate])


    const submitForm = async (e)=>{
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
                    const imageRes = await axios.patch(process.env.REACT_APP_URL_API_DATA+'/images/update/'+imageId,{images:data},{withCredentials:true});
                    if(imageRes?.data){
                        const obj  = {
                            model_id:id,
                            model_title: title,
                            model_name:modelName,
                            brand_id:brand.value,
                            brand_name:brand.label,
                            colors_available:color.map((obj)=>obj.value).join(","),
                            screen_size:screenSize.label,
                            ss_id:screenSize.value,
                            ports:ports.map((obj)=>obj.value).join(","),
                            speaker:speaker.label,
                            sp_id:speaker.value,
                            screen_type:screenType.label,
                            st_id:screenType.value,
                            refresh_rate:refreshRate.label,
                            rr_id:refreshRate.value,
                            resolution:resolution.label,
                            rs_id:resolution.value,
                            description:description
                        }
                        const modelRes = await axios.patch(process.env.REACT_APP_URL_API_DATA+'/model/update',obj,{withCredentials:true});
                        if(modelRes){
                            imageComponent.current.deleteImages().then((abc)=>{
                                setSubmited(true);
                                setTimeout(()=>{
                                    setSubmiting(false);
                                    setSubmited(false);
                                    navigate('/leds?page='+location.state.page);
                                },2000)
                            })
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
             <h2 className='text-secondary'>Edit LEDs</h2>
        </div>
        <Form noValidate validated={validated} onSubmit={submitForm}>
        <Row>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type='text' placeholder='Enter Title' value={title} onChange={(e)=>{setTitle(e.target.value)}}  disabled={true} />
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Model Name:</Form.Label>
                    <Form.Control type='text' placeholder='Enter Model Name' value={modelName} onChange={(e)=>{setModelName(e.target.value)}} required/>
                    <Form.Control.Feedback type='invalid'>Please Enter Model Name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Brand:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/brand/get`,{is_led:true})
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
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/color/get`,{is_led:true})
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
  
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Ports:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ports/get`,{filters:{is_led:true}})
                                .then(data=>{        
                                    const getData = data.data.map(({id,label})=> ({ value: label, label }));
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
                    <Form.Control.Feedback type='invalid'>Please Select speaker.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please Enter Description</Form.Control.Feedback>
                </Form.Group>
                <Form.Group  as={Col} lg='12' md='12' sm='12'>
                    <EditImageUploader ref={imageComponent} selectedFiles={images} setSelectedFiles={setImages} />
                    <Form.Control hidden value={images.length > 0?images:null} required/>
                    <Form.Control.Feedback type='invalid'>Please Upload atleast One Image.</Form.Control.Feedback>
                </Form.Group>
            </Row>
            
            <Form.Group>
                <Form.Control type='button' value='Update' onClick={submitForm}  className="btn btn-primary" />
            </Form.Group>
        </Form>
        </AddForm>
    </> );
}
 
export default EditLEDs;
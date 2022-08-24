import React,{useEffect,useState,useRef} from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Markdown from '../../Components/Markdown/Markdown';
import AddForm from '../../Components/AddForm';
import EditImageUploader from '../../Components/ImageUploader/EditImageUploader';
import SubmitWaiting from '../../Components/SubmitWaiting/SubmitWaiting';


const EditLaptops = () => {

    const {id} = useParams();
    
    const navigate = useNavigate();

    const location = useLocation();

    const [validated,setValidated] = useState(false);
    
    const [filterInput,setFilterInput] = useState("");

    const [title,setTitle] = useState("");
    const [modelName,setModelName] = useState("");
    const [brand,setBrand] = useState("");
    const [color,setColor] = useState([]);
    const [storageSsd,setStorageSsd] = useState("");
    const [storage,setStorage] = useState("");
    const [laptopType,setLaptopType] = useState("");
    const [screenType,setScreenType] = useState("");
    const [ram,setRam] = useState("");
    const [ramType,setRamType] = useState("");
    const [generation,setGeneration] = useState("");
    const [graphicCardSpecs,setGraphicCardSpecs] = useState("");
    const [graphicCardType,setGraphicCardType] = useState("");
    const [processor,setProcessor] = useState("");
    const [ports,setPorts] = useState([]);
    const [speaker,setSpeaker] = useState("");
    const [screenSize,setScreenSize] = useState("");
    const [refreshRate,setRefreshRate] = useState("");
    const [resolution,setResolution] = useState("");
    const [webcam,setWebcam] = useState("");
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
        axios.post(process.env.REACT_APP_URL_API_DATA+'/model/laptops/'+id).then((res)=>{
                setTitle(res.data[0].title);
                setModelName(res.data[0].model_name);
                setBrand({ value: res.data[0].brand_id, label: res.data[0].brand_name });
                setColor(res.data[0].colors_available.split(",").map((color)=> ({value:color,label:color})))
                setStorage({value:res.data[0].storage_id,label:res.data[0].storage})
                setStorageSsd({value:res.data[0].storage_ssd_id,label:res.data[0].storage_ssd})
                setRam({value:res.data[0].ram_id,label:res.data[0].ram})
                setRamType({value:res.data[0].rt_id,label:res.data[0].ram_type})
                setProcessor({value:res.data[0].p_id,label:res.data[0].processor})
                setGeneration({value:res.data[0].g_id,label:res.data[0].generation})
                setGraphicCardSpecs({value:res.data[0].gcs_id,label:res.data[0].graphic_card_specs})
                setGraphicCardType({value:res.data[0].gct_id,label:res.data[0].graphic_card_type})
                setLaptopType({value:res.data[0].lt_id,label:res.data[0].laptop_type})
                setPorts(res.data[0].ports.split(",").map((port)=>({value:port,label:port})))
                setSpeaker({value:res.data[0].sp_id,label:res.data[0].speaker})
                setResolution({value:res.data[0].rs_id,label:res.data[0].resolution})
                setRefreshRate({value:res.data[0].rr_id,label:res.data[0].refresh_rate})
                setScreenSize({value:res.data[0].ss_id,label:res.data[0].screen_size})
                setScreenType({value:res.data[0].st_id,label:res.data[0].screen_type})
                setWebcam({value:res.data[0].w_id,label:res.data[0].webcam})
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
        setTitle(`${brand?brand.label:""}-${modelName}-${processor?processor.label:""}-${generation?generation.label:""}-${ram?ram.label:""}${storage&&storageSsd?`/(${storage?storage.label:""}&${storageSsd?storageSsd.label:""})`:storage?"-"+storage.label:storageSsd?"-"+storageSsd.label:""}-${screenSize?screenSize.value:""}`);
    },[modelName,brand,processor,generation,ram,storage,storageSsd,screenSize])


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
                            storage:storage.label.toString(),
                            storage_id:storage.value,
                            storage_ssd_id:storageSsd.value,
                            storage_ssd:storageSsd.label.toString(),
                            ram:ram.label.toString(),
                            ram_id:ram.value,
                            ram_type:ramType.label,
                            rt_id:ramType.value,
                            generation:generation.label,
                            g_id:generation.value,
                            graphic_card_type:graphicCardType.label,
                            gct_id:graphicCardType.value,
                            graphic_card_specs:graphicCardSpecs.label,
                            gcs_id:graphicCardSpecs.value,
                            processor:processor.label,
                            p_id:processor.value,
                            ports:ports.map((obj)=>obj.value).join(","),
                            speaker:speaker.label,
                            sp_id:speaker.value,
                            screen_type:screenType.label,
                            st_id:screenType.value,
                            refresh_rate:refreshRate.label,
                            rr_id:refreshRate.value,
                            resolution:resolution.label,
                            rs_id:resolution.value,
                            webcam:webcam.label,
                            w_id:webcam.value,
                            description:description,
                            images:imageId
                        }
                        const modelRes = await axios.patch(process.env.REACT_APP_URL_API_DATA+'/model/update',obj,{withCredentials:true});
                        if(modelRes){
                            imageComponent.current.deleteImages().then((abc)=>{
                                setSubmited(true);
                                setTimeout(()=>{
                                    setSubmiting(false);
                                    setSubmited(false);
                                    navigate('/laptops?page='+location.state.page)
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
             <h2 className='text-secondary'>Edit Laptops</h2>
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
                    <Form.Control.Feedback type='invalid'>Please Enter Modal Name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>Brand:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/brand/get`,{is_laptop:true})
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
                    <Form.Control.Feedback type='invalid'>Please select Brand.</Form.Control.Feedback>
                    
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
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/color/get`,{is_laptop:true})
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
                    <Form.Control.Feedback type='invalid'>Please select Color.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>HDD:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/storage/get`,{is_laptop:true,is_hdd:true})
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
                    <Form.Control.Feedback type='invalid'>Please select HDD.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='model_name' >
                    <Form.Label className='asterik-label'>SSD:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/storage/get`,{is_laptop:true,is_ssd:true})
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
                            setStorageSsd(e)
                        }}
                        value={storageSsd}
                        
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={storageSsd} required />
                    <Form.Control.Feedback type='invalid'>Please select SSD.</Form.Control.Feedback>
                    
                </Form.Group>

                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>RAM:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ram/get`,{is_laptop:true})
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
                    <Form.Control.Feedback type='invalid'>Please select RAM.</Form.Control.Feedback>
                    
                </Form.Group>
                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>RAM Type:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ram-type/get`)
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
                            setRamType(e)
                        }}
                        value={ramType}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={ramType} required />
                    <Form.Control.Feedback type='invalid'>Please select RAM Type.</Form.Control.Feedback>
                    
                </Form.Group>

                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Processor:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/processor/get`,{is_laptop:true})
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
                    <Form.Control.Feedback type='invalid'>Please select Processor.</Form.Control.Feedback>
                    
                </Form.Group>
                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Generation:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/generation/get`)
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
                            setGeneration(e)
                        }}
                        value={generation}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={generation} required />
                    <Form.Control.Feedback type='invalid'>Please select Generation.</Form.Control.Feedback>
                    
                </Form.Group>
                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Graphic Card Specs:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/graphic-card-specs/get`)
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
                            setGraphicCardSpecs(e)
                        }}
                        value={graphicCardSpecs}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={graphicCardSpecs} required />
                    <Form.Control.Feedback type='invalid'>Please select Graphic Card Specs.</Form.Control.Feedback>
                    
                </Form.Group>

                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Graphic Card Type:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/graphic-card-type/get`)
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
                            setGraphicCardType(e)
                        }}
                        value={graphicCardType}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={graphicCardType} required />
                    <Form.Control.Feedback type='invalid'>Please select Graphic Card Type.</Form.Control.Feedback>
                    
                </Form.Group>

                
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Laptop Type:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/laptop-type/get`)
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
                            setLaptopType(e)
                        }}
                        value={laptopType}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={laptopType} required />
                    <Form.Control.Feedback type='invalid'>Please select Laptop Type.</Form.Control.Feedback>
                    
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
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/ports/get`,{filters:{is_laptop:true}})
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
                    <Form.Control.Feedback type='invalid'>Please select Ports.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please select Speaker.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please select Resolution.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please select Refresh Rate.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please select Screen Size.</Form.Control.Feedback>
                    
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
                    <Form.Control.Feedback type='invalid'>Please select Screen Type.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='4' md='6' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Webcam:</Form.Label>
                    <AsyncSelect 
                        className='react-select'
                        cacheOptions
                        defaultOptions
                        loadOptions={()=>{
                            return new Promise((resolve,reject)=>{
                                axios.post(process.env.REACT_APP_URL_API_DATA+`/webcam/get`)
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
                            setWebcam(e)
                        }}
                        value={webcam}
                        onInputChange={(newInput)=>{
                            const inputValue = newInput.replace(/\W/g, '');
                            setFilterInput(inputValue);
                            return inputValue;
                        }}
                    />
                    <Form.Control hidden value={webcam} required />
                    <Form.Control.Feedback type='invalid'>Please select Webcam.</Form.Control.Feedback>
                    
                </Form.Group>
                <Form.Group as={Col} lg='12' md='12' sm='12' className='mb-3' controlId='title' >
                    <Form.Label className='asterik-label'>Description:</Form.Label>
                    <Markdown value={description} setValue={setDescription} placeholder='Enter Description (5,000 Characters)' />
                    <Form.Control hidden as='textarea' placeholder='Enter Description (5,000 Characters)' value={description} onChange={(e)=>{setDescription(e.target.value)}} maxLength={5000} required/>
                    <Form.Control.Feedback type='invalid'>Please Enter Description.</Form.Control.Feedback>
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
 
export default EditLaptops;
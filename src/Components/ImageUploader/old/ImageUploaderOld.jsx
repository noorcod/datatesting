import React,{useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import style from '../../styles/modelModalContent.module.css';
import inputStyle from '../../styles/inputField.module.css';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import inputImage from '../../assets/images/Content.png';
import { useDropzone } from 'react-dropzone';

import arrayMove from 'array-move';

import { Draggable } from "react-drag-reorder";
import UploadingLoader from '../UploadingLoader/UploadingLoader';
import axios from 'axios';

const NUMBER_OF_IMAGES = 10;

const Image = ({src,onDelete,primary}) => {
    return (<>
        <div className={inputStyle.image} style={{overflow:'hidden'}}>
            {   primary &&
                <span className='tag'>Primary</span>
            }
            <FontAwesomeIcon className='icon' icon={faClose} onClick={()=>onDelete(src)}/>
            <div className='img' >
                <img src={src.preview} alt="" width='100%' height='auto' />
            </div>
            
        </div>
    </>)
}



const RenderPhotos = ({source,setSource,onDelete,getInputProps,disabled}) => {
    const [dragKey,setDragKey] = useState(1)
    useEffect(()=>{
        setDragKey(prev=>prev+1);
    },[source])
    const handlePosChange = (currentPos, newPos)=>{
        setSource(arrayMove(source,currentPos,newPos))
    }


    return(
        <div>
            <Row className={`align-items-center`} 
            onClick={(e)=>{
                if(e.target.tagName !== 'LABEL'){   
                    e.preventDefault()
                }
            }}
            > 
                {
                    disabled?
                    <>
                        {
                            source.map((photo,index)=>{
                                return (
                                <Col lg='4' md='6' sm='12' key={index} className={inputStyle.minWidth} >
                                    <Image src={photo} onDelete={onDelete} primary={index===0}/>
                                </Col>
                            )})
                        }
                    </>:
                    <Draggable key={dragKey} onPosChange={handlePosChange} className={inputStyle.drag} >
                    {
                        source.map((photo,index)=>{
                            return (
                            <Col lg='4' md='6' sm='12' key={index} className={inputStyle.minWidth} >
                                <Image src={photo} onDelete={onDelete} primary={index===0} />
                            </Col>
                        )})
                    }
                    
                    </Draggable>
                    
                }
                {
                source.length <NUMBER_OF_IMAGES && !disabled?
                <Form.Group as={Col} lg='4' md='6' sm='12' className={`${inputStyle.uploadBtn} ${inputStyle.minWidth}`}>
                    <Form.Label
                    name="label"
                    >
                        +
                        <Form.Control 
                            {...getInputProps()}
                            disabled={disabled}
                        />
                    </Form.Label>
                </Form.Group>:
                ""
                }
            </Row>
        </div>
    ) 
}




const ImageUploader = ({setImages}) => {

    const [selectedFiles,setSelectedFiles] = useState([])

    const [noOfImageError,setNoOfImageError] = useState(false);

    const [uploading,setUploading] = useState(false);
    const [uploaded,setUploaded] = useState(false);

    const [isEmpty,setIsEmpty] = useState(true);
    const [isClicked,setIsClicked] = useState(false);

    const [modal,setModal] = useState(false);
    const showModal = () =>{
        setModal(true)
    }
    const closeModal = () =>{
        setModal(false)
    }

    const { getRootProps,getInputProps } = useDropzone({
        accept:{
            'image/png':['.png'],
            'image/jpeg':['.jpg','.jpeg']
        },
        onDrop: (acceptedFiles) => {
            setIsEmpty(false)
            const filesArray = acceptedFiles.map((file)=> ({preview:URL.createObjectURL(file),data:file}));
    

            if((selectedFiles.length+filesArray.length) < NUMBER_OF_IMAGES+1 ){  
                setSelectedFiles((prevImage)=>[...prevImage,...filesArray]);
                setNoOfImageError(false) 
                showModal();
            }
            else{
                setNoOfImageError(true);
            }
            acceptedFiles.map((file)=> URL.revokeObjectURL(file));
        }
    });


    const onDelete = (photo) =>{
        if(!uploaded){
            setSelectedFiles((prevImage)=>prevImage.filter((img => img !== photo)))
            setNoOfImageError(false)
            if(selectedFiles.length === 1){
                setIsEmpty(true);
            }
        }
    }
    
    const handleImageUpload =() =>{
        setIsClicked(true);
        if(selectedFiles.length > 0){
            setUploading(true);
            const formData = new FormData();
            selectedFiles.map((file)=>{
                formData.append('files',file.data,file.data.name)
            })
            axios.post(`${process.env.REACT_APP_URL_IMAGE_CDN}/images`,formData,{headers:{'Accept':'application/json','content-type':'multipart/form-data'}}).then(({data})=>{
                setImages(data.files)
                setUploaded(true)
                setUploading(false);
            })
        }else{
        }
        
    }

    return ( <>
        <Form.Group className={inputStyle.section}>
            <Form.Label 
                {...getRootProps({
                    onClick:(e)=>{ 
                        if(selectedFiles.length > 0 ){
                            e.preventDefault();
                            showModal();
                        }else{
                            if(e.target.children[4].value.length === 0){
                                e.preventDefault()
                            }
                        }
                    }
                })}
                
                disabled={uploaded}
            >
                <img src={inputImage} alt='upload ' />
                <br />
                {
                    uploaded?
                    <span>Uploaded</span>:
                    <span>{selectedFiles.length} Images Added</span>
                }
                
                <br />
                <Form.Control
                    {...getInputProps({
                        onInput:(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    showModal()
                                },
                        onClick:(e)=>{ 
                            // e.preventDefault()
                            if(selectedFiles.length > 0){
                                e.preventDefault()
                            }
                        }
                        })
                    }

                    disabled={uploaded}
                />
                {
                    noOfImageError &&
                    <span style={{color:'red'}}>You Try to Add more then {NUMBER_OF_IMAGES} Images</span>
                }
            </Form.Label>
            
        </Form.Group>
        
        <Modal show={modal} onHide={closeModal} animation={false} className={style.shoaib} >
            <Modal.Header>
                <Modal.Title>
                    Images Previews
                    {
                        noOfImageError &&
                        <span style={{color:'red',fontSize:'14px',marginLeft:'70px'}}>You Try to Add more then {NUMBER_OF_IMAGES} Images</span>
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-between'>
                <RenderPhotos source={selectedFiles} setSource={setSelectedFiles} onDelete={onDelete}  getInputProps={getInputProps} disabled={uploaded}/>
            </Modal.Body>
            <Modal.Footer>
                {
                uploaded?
                <div className='d-flex gap-5 align-items-center'>
                    <span style={{color:'orangered'}}>Uploaded</span>
                    <Button variant={'danger'} onClick={closeModal}>Done</Button>
                </div>:
                <div className='d-flex gap-5 align-items-center'>
                {   
                    uploading && 
                    <UploadingLoader />
                }
                {
                    isEmpty && isClicked &&
                    <span style={{color:'orangered'}}>Atleast select one Image.</span>
                }
                <Button variant={uploading?'secondary':'primary'} disabled={(uploading || isEmpty) && isClicked } onClick={handleImageUpload}>{uploading?"Uploading":"Upload"}</Button>
                </div>
                }
            </Modal.Footer>
        </Modal>
    </> );
}
 
export default ImageUploader;
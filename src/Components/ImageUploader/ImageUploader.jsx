import React,{useEffect, useState,forwardRef,useImperativeHandle  } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import inputStyle from './imageUploader.module.css';
import { faClose, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDropzone } from 'react-dropzone';

import arrayMove from 'array-move';

import { Draggable } from "react-drag-reorder";
import axios from 'axios';

const NUMBER_OF_IMAGES = 10;

const Image = ({src,onDelete,primary}) => {
    return (<>
        <div className={inputStyle.image} style={{overflow:'hidden'}}>
            {   primary &&
                <span className='tag'><FontAwesomeIcon icon={faStar}/></span>
            }
            <FontAwesomeIcon className='icon' icon={faClose} onClick={()=>onDelete(src)}/>
            <div className='img' >
                <img src={src.preview} alt="" width='100%' height='auto' />
            </div>
            
        </div>
    </>)
}



const RenderPhotos = ({source,setSource,onDelete}) => {
    const [dragKey,setDragKey] = useState(1)
    useEffect(()=>{
        setDragKey(prev=>prev+1);
    },[source])
    const handlePosChange = (currentPos, newPos)=>{
        setSource(arrayMove(source,currentPos,newPos))
    }
    return(
        <div style={{padding:'0 10%'}}>
    <div className='row justify-content-center'>
        <Draggable key={dragKey} onPosChange={handlePosChange} className={`${inputStyle.drag} `} >
            {
                source.map((photo,index)=>{
                    return (
                    <div key={index} className={`${inputStyle.minWidth} col-lg-4 col-md-6 col-sm-12`} >
                        <Image src={photo} onDelete={onDelete} primary={index===0} />
                    </div>
                )})
            }
        </Draggable>
    </div>
    </div>
    ) 
}




const ImageUploader = forwardRef(({selectedFiles,setSelectedFiles},ref) => {

    const [noOfImageError,setNoOfImageError] = useState(false);
    const [sizeOfImageError,setSizeOfImageError] = useState(false);

    const { getRootProps,getInputProps, open } = useDropzone({
        accept:{
            'image/png':['.png'],
            'image/jpeg':['.jpg','.jpeg']
        },
        onDrop: (acceptedFiles, fileRejections) => {
            setSizeOfImageError(false)
            fileRejections.forEach(file =>{
                file.errors.forEach(err=>{
                    if(err.code === 'file-too-large'){
                        setSizeOfImageError(true);
                    }
                })
            })
            const filesArray = acceptedFiles.map((file)=> ({preview:URL.createObjectURL(file),data:file}));
            if((selectedFiles.length+filesArray.length) < NUMBER_OF_IMAGES+1 ){  
                setSelectedFiles((prevImage)=>[...prevImage,...filesArray]);
                setNoOfImageError(false) 
            }
            else{
                setNoOfImageError(true);
            }
            acceptedFiles.map((file)=> URL.revokeObjectURL(file));
        }
        ,
        // maxFiles:10,
        maxSize: 2621440
    });


    const onDelete = (photo) =>{
        setSelectedFiles((prevImage)=>prevImage.filter((img => img !== photo)))
        setNoOfImageError(false)
        setSizeOfImageError(false)
    }
    
    useImperativeHandle(ref,()=>({
        uploadingImages : () =>{
            return new Promise((resolve,reject)=>{
                if(selectedFiles.length > 0){
                    const formData = new FormData();
                    selectedFiles.map((file)=>{
                        formData.append('files',file.data,file.data.name)
                    })
                    axios.post(`${process.env.REACT_APP_URL_IMAGE_CDN}/images`,formData,{headers:{'Accept':'application/json','content-type':'multipart/form-data'}}).then(({data})=>{
                        resolve(data.files)
                    }).catch((err)=>{
                        reject(err)
                    })
                }else{
                }   
            })
            
        }
    }))
    

    return ( <>
        <Form.Group className={inputStyle.section}>
            <RenderPhotos source={selectedFiles} setSource={setSelectedFiles} onDelete={onDelete}  getInputProps={getInputProps}/>
            <Form.Label 
            {...getRootProps({
                onClick:(e)=>{ 
                    e.preventDefault();
                }
            })}
            style={selectedFiles.length > 0? {display:'none'}:{}}
            >
            <strong>Choose images</strong> or drag here
            <Form.Control
                {...getInputProps()}
            />
            
        </Form.Label>
            <hr />
            {
                sizeOfImageError &&
                <span style={{color:'red'}}>You Try to Add Image with size more then 2.5 MBs.</span>
            }
            <br />
            {
                noOfImageError?
                <span style={{color:'red'}}>You Try to Add more then {NUMBER_OF_IMAGES} Images</span>:
                <span>{selectedFiles.length} Images Added</span>
            }
                
            <br />
            {
                selectedFiles.length < 10 &&
                <Button onClick={open}>Add Images</Button>
            }
            
        </Form.Group>
    </> );
})
 
export default ImageUploader;
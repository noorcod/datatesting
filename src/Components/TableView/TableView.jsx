import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen,faTrash } from '@fortawesome/free-solid-svg-icons';
import styleClasses from '../../styles/TableView.module.css';
import { Modal } from 'react-bootstrap';
import { Row, Col, Button } from 'react-bootstrap'
import triangle from '../../assets/images/triangle.svg'
import dangerline from '../../assets/images/dangerline.svg'


const FIELD_LENGTH = 70;
const transform =(text)=>{
    const temp = text.split('_');
    let ret = "";
    temp.forEach((txt)=>{
        ret += " "+txt.charAt(0).toUpperCase()+txt.slice(1);
    })
    return ret;
}


const TB = ({data}) =>{
    const [full,setFull] = useState(false);
    return(<td className={`border-bottom-0 ${styleClasses.tbBG} `}>
        {full?
        `${data}`:
        data.length > FIELD_LENGTH?
        `${data.substring(0,FIELD_LENGTH)}`:
        `${data}` }
        {
            full?
            data.length > FIELD_LENGTH?
            <span style={{color:'red',cursor:'pointer'}} onClick={()=>setFull(false)}>(less)</span>:
            ""
            :
            data.length > FIELD_LENGTH?
            <span style={{color:'blue',cursor:'pointer'}} onClick={()=>setFull(true)}>(...)</span>
            :
            `` 
        }
    </td>
    )
}


const TableView = ({data,edit,remove}) => {

    const [deleteModal,setDeleteModal] = useState(false);
    const [id,setId] = useState();
    
    
    const deleteConfirm = (id) =>{
        remove(id);
        setDeleteModal(false);
    }

    const cancelConfirm = () =>{
        setDeleteModal(false);
    }

    return ( <>
    {
        !data[0] ?
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <div className={styleClasses.ldsEllipsis} ><div></div><div></div><div></div><div></div></div>
        </div> :
        <Table responsive striped className='rounded-3 mt-5 bg-white border-1 border-secondary overflow-auto' style={{marginBottom:'100px'}}>
            <thead className='text-secondary' style={{ fontSize: '13px', fontWeight: '400', lineHeight: '18px' }}>
            <tr>{
                Object.keys(data[0]).map((s,index)=>{
                    if(!['id'].includes(s)){
                        return (<th key={index}>{transform(s)}</th>)
                    }
                })
                }
                <th className='border-start'>Actions</th>
            </tr>
            </thead>
            <tbody>
                {
                    data.map((row,index)=>(
                        <tr className='border-bottom' key={index} data-color-mode="light">
                            {Object.entries(row).map(([d,s],i)=>{
                                if(!['id'].includes(d)){
                                    return (<TB data={s} key={i} />)
                                }
                            })}
                            <td className=' border-start border-bottom-0 ' style={{width:'150px'}}>
                                <div className='d-flex align-items-center gap-3 justify-content-center' >
                                    <FontAwesomeIcon icon={faPen} onClick={()=>edit(row['id'])} style={{cursor:'pointer'}} data-toggle="tooltip" data-placement="top" title="Edit"/>
                                    <FontAwesomeIcon icon={faTrash} onClick={()=>{setDeleteModal(true);setId(row['id'])}} style={{cursor:'pointer'}} data-toggle="tooltip" data-placement="top" title="Delete"/>
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
        
        
    }
        <Modal  show={deleteModal} onHide={cancelConfirm} animation={false} centered>
            <Modal.Header>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex justify-content-center pb-4'>
                    <img src={triangle} alt="triangle" />
                    <img src={dangerline} alt="dangerline" style={{ position: 'absolute', right:'auto', top:'2.2rem' }} />
                </div>
                <div >
                    <span className='d-flex justify-content-center pb-4'>Do you really want to delete this?</span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex gap-3'>
                    <Button className='w-100 rounded-3' onClick={cancelConfirm}>Cancel</Button>
                    <Button className='w-100' variant='danger' onClick={()=>deleteConfirm(id)} >Delete</Button>
                </div>
            </Modal.Footer>
        </Modal>

    </> );
}
 
export default TableView;
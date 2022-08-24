import React,{useEffect,useState,useRef} from 'react'
import TableView from '../../Components/TableView/TableView';
import { Link,useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PaginationBar from '../../Components/PaginationBar/PaginationBar';

const DELAY_TIME = 100;

const Storage = () => {
    const navigate = useNavigate()
    const [data,setData] = useState([]);
    const [dataRefresh,toggle] =useState(false)

    const [isCategory,setIsCategory] = useState({is_mobile:true})
    const [isDisk,setIsDisk] = useState({})

    const [noOfPages,setNoOfPages] = useState(1)
    const [sizeOfPages,setSizeOfPages] = useState(10)
    const [currentPage,setCurrentPage] = useState(1)

    const [noRecord, setNoRecord] = useState(false);

    const [search,setSearch] = useState("");
    const currentSearch = useRef();
    currentSearch.current = search;

    const [searchParams] = useSearchParams();
    useEffect(()=>{
        if(searchParams.get('page')){   
            setCurrentPage(Number(searchParams.get('page'))) 
        }
        if(searchParams.get('category')){
            const category = searchParams.get('category');
            if(category === 'mobile'){
                setIsCategory({is_mobile:true})
            }else 
            if(category === 'tab'){
                setIsCategory({is_tab:true})
            }else 
            if(category === 'led'){
                setIsCategory({is_led:true})
            }else 
            if(category === 'laptop'){
                setIsCategory({is_laptop:true})
            }else 
            if(category === 'desktop'){
                setIsCategory({is_desktop:true})
            }else 
            if(category === 'accessory'){
                setIsCategory({is_accessory:true})
            }
        }
        if(searchParams.get('type')){
            const type = searchParams.get('type');
            if(type === 'ssd'){
                setIsDisk({is_ssd:true})
            }else 
            if(type === 'hdd'){
                setIsDisk({is_hdd:true})
            }
        }else{
            setIsDisk({})
        }
    },[currentPage,dataRefresh,searchParams])


    const changePage = (page)=>{
        setCurrentPage(page);
        if(Object.keys(isDisk).length === 0){
            navigate('/data/storage?page='+page+"&category="+Object.keys(isCategory)[0].split('_')[1]);
        }else{
            navigate('/data/storage?page='+page+"&category="+Object.keys(isCategory)[0].split('_')[1]+"&type="+Object.keys(isDisk)[0].split('_')[1]);
        }  
    }

    useEffect(()=>{
        const obj = {...isCategory,...isDisk,search:search}
        const pageTimeout = setTimeout(()=>{
            if(obj.is_mobile || obj.is_tab){
                axios.post(process.env.REACT_APP_URL_API_DATA+'/mobile-storage/no-of-pages?size='+sizeOfPages,obj).then((res)=>{
                    if(res.data.no_of_pages === 0){
                        setNoRecord(true);
                        if(searchParams.get('page')){   
                            setNoOfPages(0)
                            navigate('/data/storage?page=0&category='+Object.keys(isCategory)[0].split('_')[1]);
                        }
                    }else{
                        setNoRecord(false);
                        setNoOfPages(res.data.no_of_pages)
                        if(currentPage>res.data.no_of_pages){
                            setCurrentPage(res.data.no_of_pages)
                            navigate('/data/storage?page='+res.data.no_of_pages+'&category='+Object.keys(isCategory)[0].split('_')[1]);
                        }
                        if(searchParams.get('page')=== '0'){
                            setCurrentPage(1)
                            navigate('/data/storage?page=1&category='+Object.keys(isCategory)[0].split('_')[1]);
                        }
                    }
                })
            }else{
                axios.post(process.env.REACT_APP_URL_API_DATA+'/storage/no-of-pages?size='+sizeOfPages,obj).then((res)=>{
                    if(res.data.no_of_pages === 0){
                        setNoRecord(true);
                        if(searchParams.get('page')){   
                            setNoOfPages(0)
                            if(Object.keys(isDisk).length === 0){
                                navigate('/data/storage?page=0&category='+Object.keys(isCategory)[0].split('_')[1]);
                            }else{
                                navigate('/data/storage?page=0&category='+Object.keys(isCategory)[0].split('_')[1]+'&type='+Object.keys(isDisk)[0].split('_')[1]);
                            } 
                        }
                    }else{
                        setNoRecord(false);
                        setNoOfPages(res.data.no_of_pages)
                        if(currentPage>res.data.no_of_pages){
                            setCurrentPage(res.data.no_of_pages)
                            if(Object.keys(isDisk).length === 0){
                                navigate('/data/storage?page='+res.data.no_of_pages+'&category='+Object.keys(isCategory)[0].split('_')[1]);
                            }else{
                                navigate('/data/storage?page='+res.data.no_of_pages+'&category='+Object.keys(isCategory)[0].split('_')[1]+'&type='+Object.keys(isDisk)[0].split('_')[1]);
                            } 
                            
                        }
                        if(searchParams.get('page')=== '0'){
                            setCurrentPage(1)
                            if(Object.keys(isDisk).length === 0){
                                navigate('/data/storage?page=1&category='+Object.keys(isCategory)[0].split('_')[1]);
                            }else{
                                navigate('/data/storage?page=1&category='+Object.keys(isCategory)[0].split('_')[1]+'&type='+Object.keys(isDisk)[0].split('_')[1]);
                            } 
                        }
                    }
                })
            }
        },DELAY_TIME);
        return ()=>{
            clearTimeout(pageTimeout);
        }
    },[sizeOfPages,data,navigate,isCategory,currentPage,searchParams,isDisk,search])



    useEffect(()=>{
        let searchObj ={}
        if(Object.keys(isDisk).length === 0){
            searchObj = {...isCategory}
        }else{
            searchObj = {...isCategory,...isDisk}
        }
        if(search?.length > 0){
            searchObj = {...searchObj,search:search}
        }
        const dataTimeout = setTimeout(()=>{
            if(!noRecord){
                if(searchObj.is_mobile || searchObj.is_tab){
                    axios.post(process.env.REACT_APP_URL_API_DATA+'/mobile-storage/get?page='+currentPage+'&size='+sizeOfPages,searchObj).then((res)=>{
                        setData(res.data)
                    })
                }else{
                    axios.post(process.env.REACT_APP_URL_API_DATA+'/storage/get?page='+currentPage+'&size='+sizeOfPages,searchObj).then((res)=>{
                        setData(res.data)
                    })
                }
    
            }
        },DELAY_TIME);
        return ()=>{
            clearTimeout(dataTimeout);
            if(currentSearch.current !== search){
                setCurrentPage(1)
                if(Object.keys(isDisk).length === 0){
                    navigate('/data/storage?page=1&category='+Object.keys(isCategory)[0].split('_')[1]);
                }else{
                    navigate('/data/storage?page=1&category='+Object.keys(isCategory)[0].split('_')[1]+'&type='+Object.keys(isDisk)[0].split('_')[1]);
                }
            }
        }
    },[isCategory,isDisk,dataRefresh,currentPage,sizeOfPages,search,navigate,noRecord])


    const isDiskOnChange =(e)=>{
        if(e.target.value === 'all'){
            setIsDisk({});
            navigate('/data/storage?page='+currentPage+'&category='+Object.keys(isCategory)[0].split('_')[1]);
        }else{
            const temp = Object();
            temp[e.target.value] = true;
            setIsDisk(temp);
            navigate('/data/storage?page='+currentPage+'&category='+Object.keys(isCategory)[0].split('_')[1]+'&type='+e.target.value.split('_')[1]);
        }
        
         
    }
    const isCategoryOnChange = (e)=>{
        const temp = Object();
        temp[e.target.value] = true;
        setIsCategory(temp);
        setSearch("");
        if(temp.is_mobile || temp.is_tab){
            setIsDisk({});
            navigate('/data/storage?page='+currentPage+'&category='+e.target.value.split('_')[1]);
        }else{
            if(Object.keys(isDisk).length === 0){
                navigate('/data/storage?page='+currentPage+'&category='+e.target.value.split('_')[1]);
            }else{
                navigate('/data/storage?page='+currentPage+'&category='+e.target.value.split('_')[1]+'&type='+Object.keys(isDisk)[0].split('_')[1]);
            } 
        }
    }

    const edit =(id)=>{
        navigate(`/data/storage/edit/${id}`,{state:{page:currentPage,category:isCategory,type:isDisk}});
    }

    const remove =(id)=>{
        let searchObj ={}
        searchObj = {...isCategory}
        if(searchObj.is_mobile || searchObj.is_tab){
            axios.delete(`${process.env.REACT_APP_URL_API_DATA}/mobile-storage/delete/${id}`,{},{ withCredentials: true}).then((res)=>{
                toggle(prev=>!prev);
            })
        }else{
            axios.delete(`${process.env.REACT_APP_URL_API_DATA}/storage/delete/${id}`,{ withCredentials: true}).then((res)=>{
                toggle(prev=>!prev);
            })
        }
        
    }

    const handleSearchInput = (e) =>{
        setSearch(e.target.value)
    }

    return ( <>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Storage</h2>
        </div>
        <div className='d-flex justify-content-between align-items-center mx-4'> 
            <div>
                <select name='is_category' value={  Object.keys(isCategory)[0]} onChange={isCategoryOnChange} className='btn btn-primary m-4'>
                    <option value='is_mobile'>Mobile</option>
                    <option value='is_tab'>Tab</option>
                    <option value='is_laptop'>Laptop</option>
                    <option value='is_desktop'>Desktop Computer</option>
                </select>
                {
                    (!isCategory.is_tab && !isCategory.is_mobile) &&
                    <select name='is_disk' value={Object.keys(isDisk).length === 0 ? 'all' :Object.keys(isDisk)[0]} onChange={isDiskOnChange} className='btn btn-secondary m-4'>
                        <option value='all'>All</option>
                        <option value='is_ssd'>SSD</option>
                        <option value='is_hdd'>HDD</option>
                    </select>
                }
                <input type='search' placeholder='Search' className='px-3 rounded' value={search} onChange={handleSearchInput} />
            </div>
            <Link to='/data/storage/add'
                state={{lastPage:currentPage,page:noOfPages+1,category:isCategory,type:isDisk}}
                >
                <button>Add Storage</button>
            </Link>
        </div>
        {noRecord ? (
            <div style={{padding:'50px 0px'}}>
                <div style={{width:'100%',height:'100px',backgroundColor:'white',textAlign:'center',padding:'35px',fontWeight:'bolder',borderRadius:'10px'}}>
                    Record Not Found
                </div>
            </div>
        ) : (
            <>
            <TableView data={data} edit={edit} remove={remove} />
            <PaginationBar
                noOfPages={noOfPages}
                currentPage={currentPage}
                changePage={changePage}
            />
            </>
        )}
    </> );
}
 
export default Storage;
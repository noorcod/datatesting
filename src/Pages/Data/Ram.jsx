import React,{useEffect,useState,useRef} from 'react'
import TableView from '../../Components/TableView/TableView';
import { Link,useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PaginationBar from '../../Components/PaginationBar/PaginationBar';

const DELAY_TIME = 100;

const Ram = () => {
    const navigate = useNavigate()
    const [data,setData] = useState([]);
    const [dataRefresh,toggle] =useState(false)
    const [isCategory,setIsCategory] = useState({is_mobile:true})

    
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
        
    },[currentPage,dataRefresh,searchParams])

    const changePage = (page)=>{
        setCurrentPage(page);
        navigate('/data/ram?page='+page+"&category="+Object.keys(isCategory)[0].split('_')[1]);
    }

    useEffect(()=>{
        const pageTimeout = setTimeout(()=>{
            axios.post(process.env.REACT_APP_URL_API_DATA+'/ram/no-of-pages?size='+sizeOfPages,{...isCategory,search:search}).then((res)=>{
                if(res.data.no_of_pages === 0){
                    setNoRecord(true);
                    if(searchParams.get('page')){   
                        setNoOfPages(0)
                        navigate('/data/ram?page=0&category='+Object.keys(isCategory)[0].split('_')[1]);
                    }
                }else{
                    setNoRecord(false);
                    setNoOfPages(res.data.no_of_pages)
                    if(currentPage>res.data.no_of_pages){
                        setCurrentPage(res.data.no_of_pages)
                        navigate('/data/ram?page='+res.data.no_of_pages+"&category="+Object.keys(isCategory)[0].split('_')[1]);
                    }
                    if(searchParams.get('page')=== '0'){
                        setCurrentPage(1)
                        navigate('/data/ram?page=1');
                    }
                }
            })
        },DELAY_TIME);
        return ()=>{
            clearTimeout(pageTimeout);
        }
    },[sizeOfPages,data,navigate,currentPage,searchParams,isCategory,search])


    useEffect(()=>{
        const dataTimeout = setTimeout(()=>{
            if(!noRecord){
                axios.post(process.env.REACT_APP_URL_API_DATA+'/ram/get?page='+currentPage+'&size='+sizeOfPages,{...isCategory,search:search}).then((res)=>{
                    setData(res.data)
                })
            }
        },DELAY_TIME);
        return ()=>{
            clearTimeout(dataTimeout);
            if(currentSearch.current !== search){
                setCurrentPage(1)
                navigate('/data/ram?page=1');
            }
        }
    },[isCategory,dataRefresh,currentPage,sizeOfPages,search,navigate,noRecord])

    const isCategoryOnChange = (e)=>{
        const temp = Object();
        temp[e.target.value] = true;
        setIsCategory(temp);
        setSearch("");
        navigate('/data/ram?page='+currentPage+"&category="+e.target.value.split('_')[1]);
    }


    const edit =(id)=>{
        navigate(`/data/ram/edit/${id}`,{state:{page:currentPage,category:isCategory}});
    }

    const remove =(id)=>{
        axios.delete(`${process.env.REACT_APP_URL_API_DATA}/ram/delete/${id}`,{ withCredentials: true}).then((res)=>{
            toggle(prev=>!prev);
        })
    }

    const handleSearchInput = (e) =>{
        setSearch(e.target.value)
    }

    return ( <>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>RAM</h2>
        </div>
        <div className='d-flex justify-content-between align-items-center  mx-4'>
            <span>
            <select name='is_category' value={Object.keys(isCategory)[0]} onChange={isCategoryOnChange} className='btn btn-primary m-4'>
                <option value='is_mobile'>Mobile</option>
                <option value='is_tab'>Tab</option>
                <option value='is_laptop'>Laptop</option>
                <option value='is_desktop'>Desktop Computer</option>
            </select>
            <input type='search' placeholder='Search' className='px-3 rounded' value={search} onChange={handleSearchInput} />
            </span>
            <Link to='/data/ram/add'
                state={{lastPage:currentPage,page:noOfPages+1,category:isCategory}}
                >
                <button>Add RAM</button>
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
 
export default Ram;
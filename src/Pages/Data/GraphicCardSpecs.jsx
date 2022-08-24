import React,{useEffect,useState,useRef} from 'react'
import TableView from '../../Components/TableView/TableView';
import { Link,useNavigate, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import PaginationBar from '../../Components/PaginationBar/PaginationBar';

const DELAY_TIME = 100;

const GraphicCardSpecs = () => {
    const navigate = useNavigate()
    const [data,setData] = useState([]);
    const [dataRefresh,toggle] =useState(false)
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
    },[currentPage,dataRefresh,searchParams])

    const changePage = (page)=>{
        setCurrentPage(page);
        navigate('/data/graphic-card-specs?page='+page);
    }

    useEffect(()=>{
        const pageTimeout = setTimeout(()=>{
            axios.post(process.env.REACT_APP_URL_API_DATA+'/graphic-card-specs/no-of-pages?size='+sizeOfPages,{search:search}).then((res)=>{
                if(res.data.no_of_pages === 0){
                    setNoRecord(true);
                    if(searchParams.get('page')){
                        setNoOfPages(0)
                        navigate('/data/graphic-card-specs?page=0');
                    }
                }else{
                    setNoRecord(false);
                    setNoOfPages(res.data.no_of_pages)
                    if(currentPage>res.data.no_of_pages){
                        setCurrentPage(res.data.no_of_pages)
                        navigate('/data/graphic-card-specs?page='+res.data.no_of_pages);
                    }
                    if(searchParams.get('page')=== '0'){
                        setCurrentPage(1)
                        navigate('/data/graphic-card-specs?page=1');
                    }
                }
            })
        },DELAY_TIME);
        return ()=>{
            clearTimeout(pageTimeout);
        }
    },[sizeOfPages,data,navigate,currentPage,searchParams,search])

    useEffect(()=>{
        const dataTimeout = setTimeout(()=>{
            if(!noRecord){
                axios.post(process.env.REACT_APP_URL_API_DATA+'/graphic-card-specs/get?page='+currentPage+'&size='+sizeOfPages,{search:search}).then((res)=>{
                    setData(res.data)
                })
            }
        },DELAY_TIME);
        return ()=>{
            clearTimeout(dataTimeout);
            if(currentSearch.current !== search){
                setCurrentPage(1);
                navigate('/data/graphic-card-specs?page=1');
            }
        }
    },[currentPage,dataRefresh,sizeOfPages,search,navigate,noRecord])


    const edit =(id)=>{
        navigate(`/data/graphic-card-specs/edit/${id}`,{state:{page:currentPage}});
    }

    const remove =(id)=>{
        axios.delete(`${process.env.REACT_APP_URL_API_DATA}/graphic-card-specs/delete/${id}`,{ withCredentials: true}).then((res)=>{
            toggle(prev=>!prev);
        })
    }

    const handleSearchInput = (e) =>{
        setSearch(e.target.value)
    }

    return ( <>
        <div className='d-flex justify-content-center mx-4 mb-2'>
             <h2 className='text-secondary'>Graphic Card Specs</h2>
        </div>
        <div className='d-flex justify-content-between align-items-center  mx-4'>
            <input type='search' placeholder='Search' className='px-3 rounded' value={search} onChange={handleSearchInput} />
            <Link to='/data/graphic-card-specs/add'
                state={{lastPage:currentPage,page:noOfPages+1}}
                >
                <button>Add Graphic Card Specs</button>
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
 
export default GraphicCardSpecs;
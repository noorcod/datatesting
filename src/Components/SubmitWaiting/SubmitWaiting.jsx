import style from './SubmitWaiting.module.css'
import { Modal } from 'react-bootstrap';
const SubmitWaiting = ({submiting, submited, failed}) => {
    return ( <>
        <Modal show={submiting} animation={false} backdrop="static" centered className={style.modal}>
            <Modal.Body>
                {/* {
            submited?
            (<>
                <input type="checkbox" id="check" className={style.input} />
                <label className={style.label}>
                <div className="check-icon"></div>
                </label>
            </>):
            (<div className={style.loader}>
                <div className={`${style.circle} ${style.one}`}></div>
                <div className={`${style.circle} ${style.two}`}></div>
                <div className={`${style.circle} ${style.three}`}></div>
            </div>)
            } */}
            {/* <input type="checkbox" id="check" checked={submited} className={style.input} />
            <label className={style.label}>
            <div className="check-icon"></div>
            </label> */}
                {
                    submited?
                    (<svg className={`checkmark`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle " cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark__check " fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>):
                    failed?
                    (<svg className={`crossmark `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="crossmark__circle " cx="26" cy="26" r="25" fill="none"/>
                        <path className="cross__path cross__path--right " fill="none" d="M16,16 l20,20" />
                        <path className="cross__path cross__path--left " fill="none" d="M16,36 l20,-20" />
                    </svg>):
                    (<svg className={`crossmark `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" >
                        <circle className="crossmark__circle " cx="26" cy="26" r="25" fill="none"/>
                        <circle className="loader-path " cx="26" cy="26" r="17" fill="none" stroke="#ffffff" strokeWidth="3" />
                    </svg>)
                }
                    
                
            </Modal.Body>
        </Modal>
    </> );
}
 
export default SubmitWaiting;
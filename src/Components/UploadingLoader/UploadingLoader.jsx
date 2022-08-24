import style from './styling.module.css';

const UploadingLoader = () => {
    return ( <div className={style.loadingBox}>
        <div className={style.loader}></div>
    </div> );
}
 
export default UploadingLoader;
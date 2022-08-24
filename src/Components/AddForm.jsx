import style from '../styles/AddForm.module.css'
const AddForm = (props) => {
    return (
        <div className={`d-flex justify-content-center mb-4 ${style.addForm}`}>
            <div className={`bg-white shadowMain card border-0 py-4 ${style.form}`}>
                <div className={`${style.formContent}`}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default AddForm;
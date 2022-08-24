import React,{useState} from 'react';
import style from './Markdown.module.css'
import { Editor } from '@tinymce/tinymce-react';

const Markdown = ({value,setValue,placeholder}) => {
    const textProp = {
        placeholder
    }
    return ( <>
    <div className={`${style.field}`} >
        <Editor
        apiKey='v1oaw3yn9un79c63uodd74j2ecckl6kpejp444c7divbpm6m'
        onEditorChange={setValue} 
        value={value} 
        init={{
            placeholder:"Add Description here...",
            height:300,
            plugins:[
                'fullscreen',
                'wordcount'],
            toolbar: 'undo redo | styles | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | fullscreen',

            }} 
        />
    </div>
    
    </> );
}
 
export default Markdown;
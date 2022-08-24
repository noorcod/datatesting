import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RedirectComponent from './RedirectComponent';



const App = () => {

    return ( 
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<RedirectComponent />} />
                </Routes>
            </BrowserRouter>
        </>
     );
}

export default App;
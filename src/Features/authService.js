import axios from "axios";


// Login User

const login = async (userData)=> {
    const res = await axios.post(`${process.env.REACT_APP_URL_API}/auth/login-tech-bazaar-user`, userData,{ withCredentials: true});

    localStorage.setItem('refreshToken',res.data.refreshToken)
    return res.data;
}

const getUser = async (refreshToken)=> {
    const res = await axios.get(process.env.REACT_APP_URL_API +'/user/get-tech-user-by-accesstoken', { withCredentials: true, headers:{
        "Authorization": refreshToken
    } });
    return res.data;
}

const authService = {
    login,
    getUser
}

export default authService;
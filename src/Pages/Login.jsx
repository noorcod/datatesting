import React from 'react'

import FormCard from "../Components/FormCard";
import style from './../styles/Login.module.css'
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/authSlice";
import { InputGroup } from 'react-bootstrap'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [user_email, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [appError, setErrors] = useState("");
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { user, error, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (error) {
            setErrors(message);
        }
        if (user) {
            // if (window.history.state && window.history.state.idx > 0) {
            //     navigate(-1);
            // } else {
            //     navigate('/', { replace: true });
            // }
            navigate('/')
        }
    }, [user, error, message, navigate])

    const onSubmit = async (e) => {
            e.preventDefault();
            if (!user_email || !password) {
                setErrors("Fields cannot be empty");
            } else {
                const userData = { user_email, password }
                dispatch(login(userData))
            }
            setValidated(true);
        }
    return (
        <div className={`d-flex justify-content-center align-items-center ${style.wrapper} ${style.login}`}>
            <FormCard>
                <h4 className="mt-5 mb-4 text-center fw-bold">Welcome Back</h4>
                {appError && <span className="text-danger my-2 text-center">*{appError}</span>}
                <Form noValidate validated={validated} onSubmit={onSubmit}>
                    <Form.Group className="mb-4" md="4" controlId="validationCustomUsername">
                        <InputGroup hasValidation>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                className="p-2"
                                aria-describedby="inputGroupPrepend"
                                required
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                * Invalid email format
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className={`mb-4 ${style.passwordInput}`} md="4" controlId="validationCustomPassword">                        
                            <Form.Control
                                className="p-2" type={showPassword ? "text" : "password"} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required
                            />
                            <div className={`${style.passwordField}`}>
                                <FontAwesomeIcon className="text-secondary" icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword((a) => !a)} />
                            </div>
                            <Form.Control.Feedback type="invalid">
                                * Invalid Password
                            </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-end mb-4">
                        <Link className="link" to="/forget-password">Forget Password?</Link>
                    </div>
                    <div className="mb-4">
                        <button className="w-100" type="submit">Log In</button>
                    </div>
                </Form>
            </FormCard>
        </div>
    );
}

export default Login;

import './accounts.scss';
import { useState } from 'react';
import axios from 'axios';

const url_api = import.meta.env.VITE_REACT_APP_URL;

const Accounts = () => {

    const [msg, setMsg] = useState('');

    const [logdetails, setLogdetails] = useState({
        userName: '',
        password:''
    });

    const [user, setUser] = useState({
        user_name: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = ({ currentTarget: input }) => {
        setUser({ ...user, [input.name]: input.value });
    };

    const handleLogChange = ({ currentTarget: input }) => {
        setLogdetails({ ...logdetails, [input.name]: input.value });
    };

    const handleReg = async (event) => {
        try {
            event.preventDefault()
            const res = await axios.post(`${url_api}/users`, user);
            setMsg(res.data);
            if (res.data.success == 'true') {
                window.location.href = '/verify';
            } else {
                console.log(res.data);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleLog = async (event) => {
        try {
            event.preventDefault();
            const res = await axios.post(`${url_api}/login`, logdetails);
            setMsg(res.data);
            if (res.data.success == 'true') {
                localStorage.setItem("sessionToken", res.data.token)
                if (res.data.loggedUser.isAdmin == true) {
                    window.location.href = '/admin'
                } else {
                    window.location.href = '/'
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handle = () => {
        const loginText = document.querySelector(".title-text .login");
        const loginForm = document.querySelector("form.login");
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
    }
    const handle2 = () => {
        const loginText = document.querySelector(".title-text .login");
        const loginForm = document.querySelector("form.login");
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
    }
    const signUp = (event) => {
        event.preventDefault()
        handle();
        return false;
    };
    
    return (
        <div className='accounts grid'>
            <p className={`msg ${msg.success}`}>{msg.msg }</p>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">
                        Login
                    </div>
                    <div className="title signup">
                        Signup
                    </div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" defaultChecked />
                        <input type="radio" name="slide" id="signup" />
                        <label htmlFor="login" className="slide login"
                            onClick={() => handle2()}
                        >
                            Login
                        </label>
                        <label
                            htmlFor="signup"
                            className="slide signup"
                            onClick={() => handle()}
                        >
                            Signup
                        </label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form className="login" onSubmit={()=>handleLog(event)}>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    id="usern2"
                                    name='userName'
                                    required
                                    onChange={handleLogChange}
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    id="password2"
                                    name='password'
                                    required
                                    onChange={handleLogChange}
                                />
                            </div>
                            <div className="field btn">
                                <input type="submit" value="Login" />
                            </div>
                            <div className="signup-link">
                                Not a member? <a href="" onClick={()=>signUp(event)}>Signup now</a>
                            </div>
                        </form>

                        <form className="signup" onSubmit={()=>handleReg(event)}>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    id="mail" 
                                    name='email'
                                    required
                                    onChange={handleChange}    
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    id="usern" 
                                    name='user_name'
                                    required
                                    onChange={handleChange}  
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    id="phone" 
                                    name='phone'
                                    required
                                    onChange={handleChange}  
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    id="password" 
                                    name='password'
                                    required
                                    onChange={handleChange}      
                                />
                            </div>
                            <div className="field btn">
                                <input type="submit" value="Signup" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accounts;

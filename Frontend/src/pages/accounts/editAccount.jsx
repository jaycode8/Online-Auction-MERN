
import './accounts.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const EditAccount = () => {
    const { id } = useParams();
    const [msg, setMsg] = useState('');

    const [user, setUser] = useState({});

    const fetchSpecificUser = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: `${url_api}/user`,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        };
    }
    useEffect(() => {
        fetchSpecificUser();
        // window.location.reload(true);
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setUser({ ...user, [input.name]: input.value });
    };

    const handleUpdate = async (event) => {
        try {
            const userData = {
                "user_name": user.user_name,
                "email": user.email,
                "phone":user.phone
            }
            event.preventDefault();
            const res = await axios({
                method: 'patch',
                url: `${url_api}/user/${id}`,
                data:userData,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            setMsg(res.data);
            if (res.data.success == 'true') {
                window.location.href = '/'
            };
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='accounts grid'>
            <p className={`msg ${msg.success}`}>{msg.msg}</p>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">
                        Edit your profile
                    </div>
                </div>
                <div className="form-container">
                    <div className="form-inner" id='editForm'>
                        <form className="signup" onSubmit={() => handleUpdate(event)}>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    id="mail"
                                    name='email'
                                    value={user.email}
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
                                    value={user.user_name}
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
                                    value={user.phone}
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
                                    disabled
                                />
                            </div>
                            <div className="field btn">
                                <input type="submit" value="Update" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAccount;


import './nav.scss';
import { useState, useEffect } from 'react';
import { AiOutlineBars, AiOutlineUserAdd, AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { ImHammer2 } from 'react-icons/im';
import axios from 'axios';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const Nav = () => {
    const [user, setUser] = useState({});
    const [checkUser, setCheckUser] = useState({});

    const toggleMenu = () => {
        document.querySelector('ul').classList.toggle('active');
    };

    const toggleActiveUser = async () => {
        const res = await axios({
            method: 'get',
            url: `${url_api}/user`,
            headers: {
                Authorization: `Bearer ${sessionToken}`
            }
        });
        setUser(res.data.user);
        document.querySelector('.user_account_details').classList.toggle('user_details');
    };

    const checkAdmin = async () => {
        const res = await axios({
            method: 'get',
            url: `${url_api}/user`,
            headers: {
                Authorization: `Bearer ${sessionToken}`
            }
        });
        setCheckUser(res.data.user);
    };

    useEffect(() => {
        checkAdmin();
    }, []);

    const logOut = () => {
        localStorage.removeItem('sessionToken');
        window.location.href = '/';
    };
    
    return (
        <div className='navbar grid'>
            <div className='user_account_details grid'>
                <section className='grid'>
                    <p>User : {user.user_name}</p>
                    <p>email : {user.email}</p>
                    <p>phone : {user.phone}</p>
                </section>
                <button className='btn' onClick={() => logOut()}>Log Out</button>
            </div>
            <span>
                {
                    sessionToken ? (
                        checkUser.isAdmin ? (
                            <Link
                                to='/admin'
                                className='logo'
                            >
                                BIDDIT
                                <ImHammer2 className='hammer' />
                            </Link>
                        ) : (
                                <Link
                                    to='/'
                                    className='logo'
                                >
                                    BIDDIT
                                    <ImHammer2 className='hammer' />
                                </Link>
                        )
                    ): (
                            <Link
                                to='/'
                                className='logo'
                            >
                                BIDDIT
                                <ImHammer2 className='hammer' />
                            </Link>  
                    )
                }
            </span>
            {
                sessionToken ? (
                    checkUser.isAdmin ?
                        <>
                            
                        </>
                        :
                        <>
                            <ul>
                                <Link to='/' onClick={() => toggleMenu()}><li>Home</li></Link>
                                <Link to='/auctions' onClick={() => toggleMenu()}><li>Auctions</li></Link>
                                <Link to='/newAuction' onClick={() => toggleMenu()}><li>Create Auctions</li></Link>
                                <Link to='/ended' onClick={() => toggleMenu()}><li>Ended Auctions</li></Link>
                            </ul>
                            <AiOutlineBars className='Bars' onClick={() => toggleMenu()} />
                        </>
                ) : (
                    <>
                        <ul>
                            <Link to='/' onClick={() => toggleMenu()}><li>Home</li></Link>
                            <Link to='/auctions' onClick={() => toggleMenu()}><li>Auctions</li></Link>
                            <Link to='/newAuction' onClick={() => toggleMenu()}><li>Create Auctions</li></Link>
                            <Link to='/ended' onClick={() => toggleMenu()}><li>Ended Auctions</li></Link>
                        </ul>
                        <AiOutlineBars className='Bars' onClick={() => toggleMenu()} />
                    </>
                )
            }
            {
                sessionToken ?
                    <AiOutlineUser className='account2' onClick={() => toggleActiveUser()} />
                    :
                    <Link to='/acc' className='account grid'>
                        <AiOutlineUserAdd className='user' />
                    </Link>
            }
        </div>
    );
}

export default Nav;

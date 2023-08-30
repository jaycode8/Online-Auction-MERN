
import './Admin.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MdTimerOff } from 'react-icons/md';
import Swal from 'sweetalert2';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const Admin = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchItems = async () => {
        const res = await axios(`${url_api}/items`);
        setItems(res.data.items);
    };

    const fetchUsers = async () => {
        try {
            const res = await axios(`${url_api}/users`);
            setUsers(res.data.users);
        } catch (error) {
            console.log(error);
        }
    };

    const removeUser = async (id) => {
        try {
            const res = await axios({
                method: 'delete',
                url: `${url_api}/user/${id}`,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            alert(res.data.msg);
            if (res.data.success == 'true') {
                window.location.reload(true);
            } else {
                window.location.reload(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeItem = async (id) => {
        try {
            const res = await axios({
                method: 'delete',
                url: `${url_api}/item/${id}`,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            alert(res.data.msg);
            if (res.data.success == 'true') {
                window.location.reload(true);
            } else {
                window.location.reload(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAccept = async (id) => {
        try {
            const res = await axios.post(`${url_api}/accept`, { "item_id": id });
            if (res.data.success == 'true') {
                alert(res.data.msg);
                window.location.reload(true);
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, []);

    const confirmTermination = (id) => {
        Swal.fire({
            title: 'BIDDIT.COM',
            text: "Are you sure you want end this session!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, end it!'
        }).then((result) => {
            if (result.isConfirmed) {
                endAuction(id);
            }
        })
    }

    const confirmation = (id, text, func) => {
        Swal.fire({
            title: "BIDDIT.COM",
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "sure"
        }).then((result) => {
            if (result.isConfirmed) {
                func(id)
            }
        })
    }


    const endAuction = async (id) => {
        try {
            const today = new Date();
            let yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const date = { 'time': yesterday.toISOString().split('T')[0] };
            const res = await axios({
                method: 'patch',
                url: `${url_api}/item/${id}`,
                data: date,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            if (res.data.success == 'true') {
                window.location.reload(true);
            };
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const accepted_products = items.filter((product) => {
        return product.accepted == true
    });

    const non_accepted_products = items.filter((product) => {
        return product.accepted == false
    });

    const usersList = users.filter((user) => {
        return user.isAdmin == false
    });

    let currentDate = new Date();

    const active_products = items.filter((product) => {
        const futureDay = new Date(product.time);
        return futureDay >= currentDate && product.accepted == true;
    });
    const passive_products = items.filter((product) => {
        const futureDay = new Date(product.time);
        return futureDay <= currentDate && product.accepted == true;
    });

    return (
        <div className='admin'>
            <h2>Admin dashboard</h2>
            <section className='items_data'>
                <h3>Authorized items ({accepted_products.length} items)</h3>
                <h3>Active ({active_products.length} items), Ended ({passive_products.length} items)</h3>
                <div className='cards grid'>
                    {
                        active_products.map(item => (
                            <div className='card grid' key={item._id}>
                                <span className='badge'></span>
                                <div className='img'>
                                    <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                                </div>
                                <div className='details'>
                                    <section>
                                        <h4>Title: {item.prodTitle}</h4>
                                        <p>Owner: {item.owner}</p>
                                        {
                                            item.uploder == null ? <p>uploader doesnot exist</p> : <p>{item.uploder.email}</p>
                                        }
                                        <button className='btn' onClick={() => confirmation(item._id, `Are you sure to remove ${item.prodTitle}`, removeItem)}>DEL</button>
                                    </section>
                                </div>
                                <span className='timer'>
                                    <MdTimerOff onClick={() => confirmTermination(item._id)} />
                                </span>
                            </div>
                        ))
                    }
                    {
                        passive_products.map(item => (
                            <div className='card grid' key={item._id}>
                                <span className='badge off'></span>
                                <div className='img'>
                                    <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                                </div>
                                <div className='details'>
                                    <section>
                                        <h4>Title: {item.prodTitle}</h4>
                                        <p>Owner: {item.owner}</p>
                                        {
                                            item.uploder == null ? <p>uploader doesnot exist</p> : <p>{item.uploder.email}</p>
                                        }
                                        <button className='btn' onClick={() => confirmation(item._id, `Are you sure to remove ${item.prodTitle}`, removeItem)}>DEL</button>
                                    </section>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className='items_data'>
                <h3>pedding items ({non_accepted_products.length} items)</h3>
                <div className='cards grid'>
                    {
                        non_accepted_products.map(item => (
                            <div className='card grid' key={item._id}>
                                <div className='img'>
                                    <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                                </div>
                                <div className='details'>
                                    <section>
                                        <h4>Title: {item.prodTitle}</h4>
                                        <p>Owner: {item.owner}</p>
                                        {
                                            item.uploder == null ? <p>uploader doesnot exist</p> : <p>{item.uploder.email}</p>
                                        }
                                        <button className='btn' onClick={() => confirmation(item._id, `Confirm acceptance of ${item.prodTitle}`, handleAccept)}>accept</button>
                                    </section>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className='items_data'>
                <h3>Registered users ({usersList.length} users)</h3>
                <div className='users_table grid'>
                    <table>
                        <tr>
                            <th>User name</th>
                            <th>email address</th>
                            <th>phone number</th>
                            <th>Action</th>
                        </tr>
                        {
                            usersList.map(user => (
                                <tr key={user._id}>
                                    <td>{user.user_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button onClick={() => confirmation(user._id, `Are you sure to delete ${user.user_name}`, removeUser)} > remove</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </table>
                </div>
            </section >
        </div >
    );
}

export default Admin;


import './Admin.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
            const res = await axios.post(`${url_api}/accept`, {"item_id":id});
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

    const accepted_products = items.filter((product) => {
        return product.accepted == true
    });

    const non_accepted_products = items.filter((product) => {
        return product.accepted == false
    });

    const usersList = users.filter((user) => {
        return user.isAdmin == false
    });
    
    return (
        <div className='admin'>
            <h2>Admin dashboard</h2>
            <section className='items_data'>
                <h3>Authorized items ({accepted_products.length} items)</h3>
                <div className='cards grid'>
                    {
                        accepted_products.map(item => (
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
                                        <button className='btn' onClick={() => removeItem(item._id)}>DEL</button>
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
                                        <button className='btn' onClick={()=>handleAccept(item._id)}>accept</button>
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
                                        <button onClick={() => removeUser(user._id)}>remove</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Admin;


import { Link } from 'react-router-dom';
import './items.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const MyItemsModify = () => {
    const [items, setItems] = useState([]);

    const activeUser = async () => {
        const res = await axios({
            method: 'get',
            url: `${url_api}/myItems`,
            headers: {
                Authorization: `Bearer ${sessionToken}`
            }
        });
        setItems(res.data.items);
    };

    useEffect(() => {
        activeUser();
    }, []);

    return (
        <div className='itemLIst grid' id='items'>
            <h2>Choose an item to modify</h2>
            <div className='cards-container grid'>
                {
                    items.map(item => (
                        <div className='itemCard grid' key={item._id}>
                            <div className='cover-photo'>
                                <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                            </div>
                            <div className='item-desc grid'>
                                <h2>{item.prodTitle}</h2>
                                <p>{item.Overview}</p>
                                <p>owner: {item.owner}</p>
                                <Link to={`/update/${item._id}`} className='btn'>Modify</Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default MyItemsModify;

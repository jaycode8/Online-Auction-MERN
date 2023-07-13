
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const Auction = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const res = await axios(`${url_api}/items`);
        setItems(res.data.items);
    };

    useEffect(() => {
        fetchItems()
    }, []);

    let currentDate = new Date();

    const active_products = items.filter((product) => {
        const futureDay = new Date(product.time);
        return futureDay >= currentDate;
    });

    const accepted_products = active_products.filter((product) => {
        return product.accepted == true
    });
    
    return (
        <div className='body-section grid shadow'>
            <div className='side-tab'>
                <h2>Auctions</h2>
                <div className='grid'>
                    <Link to='/newAuction' className='btn'>Create auction</Link>
                    <Link to='/auctions' className='btn'>View auctions</Link>
                    <Link to='/ended' className='btn'>View Ended auctions</Link>
                    {
                        sessionToken ? <Link to='/myItems' className='btn'>my Auctions</Link> : ''
                    }
                </div>
            </div>
            <div className='recomm'>
                <h2>For you</h2>
                <div className='grid'>
                    {
                        accepted_products.slice(0,3).map((item, index) => (
                            <div className='card grid shadow' key={index}>
                                <div className='img'>
                                    <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                                </div>
                                <div className='text grid'>
                                    <span>
                                        <h3>{ item.prodTitle }</h3>
                                        <p>{item.Overview }</p>
                                        <p>by: {item.owner }</p>
                                    </span>
                                    <Link to={`/item/${item._id}`} className='btn'>View Auction</Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Auction;

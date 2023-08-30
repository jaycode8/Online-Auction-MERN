import { Link } from 'react-router-dom';
import './items.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BsFillPinAngleFill } from 'react-icons/bs';

const url_api = import.meta.env.VITE_REACT_APP_URL;

const PastItems = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const res = await axios(`${url_api}/items`);
        setItems(res.data.items);
    };

    useEffect(() => {
        fetchItems();
    }, []);
    let currentDate = new Date();
    const passive_products = items.filter((product) => {
        const futureDay = new Date(product.time);
        return futureDay <= currentDate;
    });

    return (
        <div className='itemLIst grid' id='items'>
            <h2>Sold out items</h2>
            <div className='cards-container grid'>
                {
                    passive_products.map(item => (
                        <div className='itemCard grid' key={item._id}>
                            <span className='end-badge'></span>
                            <BsFillPinAngleFill className='pinned' />
                            <div className='cover-photo'>
                                <img src={`${url_api}/uploads/${item.itemPhotos[0]}`} alt={`${item.prodTitle}`} />
                            </div>
                            <div className='item-desc grid'>
                                <h2>{item.prodTitle}</h2>
                                <p>{item.Overview}</p>
                                <p>owner: {item.owner}</p>
                                <Link to={`/item/${item._id}`} className='btn'>View</Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default PastItems;

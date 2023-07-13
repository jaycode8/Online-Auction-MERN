
import './newAuction.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const NewAuction = () => {
    const [msg, setMsg] = useState('');
    const [chosedFile, setChosedFile] = useState(null);
    const [item, setItem] = useState({
        prodTitle: "",
        owner: "",
        Overview: "",
        address: "",
        time: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const handleChange = ({ currentTarget: input }) => {
        setItem({ ...item, [input.name]: input.value });
    };

    const fileChange = (event) => {
        const image = event.target.files;
        setChosedFile(image);
        for (let i = 0; i < image.length; i++) {
            document.getElementById("photoLabel").innerHTML += `<p>${image[i].name}</p>`;
        };
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData()
            formData.append('prodTitle', item.prodTitle);
            formData.append('owner', item.owner);
            formData.append('Overview', item.Overview);
            formData.append('address', item.address);
            formData.append('time', item.time);
            formData.append('uploder', "");
            for (let i = 0; i < chosedFile.length; i++) {
                formData.append('itemPhotos', chosedFile[i]);
            }
            const res = await axios({
                method: 'post',
                url: `${url_api}/items`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            setMsg(res.data);
        } catch (error) {
            setMsg({ success: 'false', msg: 'no file uploaded' })
        }
    };
    
    return (
        <div className='newAuction grid'>
            <p className={`msg ${msg.success}`}>{msg.msg}</p>
            <div>
                <form className="new_form" onSubmit={() => handleSubmit(event)}>
                    <h3>Provide neccessary details on the product</h3>
                    <input
                        type="text"
                        name="prodTitle"
                        placeholder="Product Title"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="owner"
                        placeholder="Name of Product Owner"
                        required
                        onChange={handleChange}
                    />
                    <textarea
                        name="Overview"
                        placeholder="Product Overview"
                        required
                        onChange={handleChange}
                    >
                    </textarea>
                    <textarea
                        name="address"
                        placeholder="Physical Address"
                        required
                        id='address'
                        onChange={handleChange}
                    >
                    </textarea>
                    <input
                        type="date"
                        name="time"
                        placeholder="Auction closure date"
                        required
                        onChange={handleChange}
                    />
                    <section className="section">
                        <label>Product Photos</label>
                        <input
                            type="file"
                            name="itemPhotos"
                            id="image"
                            multiple
                            onChange={fileChange}
                        />
                        <label
                            htmlFor="image"
                            id="filelabel"
                            className="text-primary"
                        >
                            upload &uarr;
                        </label>
                        <ul id="photoLabel"></ul>
                    </section>
                    <div className='submit-button'>
                        <input
                            type="submit"
                            value="Submit"
                            className="btn"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAuction;




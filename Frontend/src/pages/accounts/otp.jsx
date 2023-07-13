
import './otp.scss';
import { useState } from 'react';
import axios from 'axios';
import { BiCheckShield } from 'react-icons/bi';

const url_api = import.meta.env.VITE_REACT_APP_URL;

const Otp = () => {
    const [msg, setMsg] = useState('');
    const [otp, setOtp] = useState({
        val1: '',
        val2: '',
        val3: '',
        val4: ''
    });
    const handleChange = ({ currentTarget: input }) => {
        setOtp({ ...otp, [input.name]: input.value });
    };
    const otp_num = { "otp":otp.val1 + otp.val2 + otp.val3 + otp.val4};

    const handleSubmit = async (event) => {
        try {
            event.preventDefault()
            const res = await axios.post(`${url_api}/verify`, otp_num);
            setMsg(res.data);
            if (res.data.success == 'true') {
                window.location.href = '/acc';
            } else {
                console.log(res.data);
            }
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <div className='otp_page grid'>
            <p className={`msg ${msg.success}`}>{msg.msg}</p>
            <div className="container">
                <header>
                    <BiCheckShield/>
                </header>
                <h4>Enter OTP Code</h4>
                <form onSubmit={()=>handleSubmit(event)}>
                    <div className="input-field">
                        <input
                            type="number"
                            name='val1'
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name='val2'
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name='val3'
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name='val4'
                            onChange={handleChange} 
                        />
                    </div>
                    <input
                        type='submit'
                        value='Verify OTP'
                        className='button'
                    />
                </form>
            </div>
        </div>
    );
};

export default Otp;
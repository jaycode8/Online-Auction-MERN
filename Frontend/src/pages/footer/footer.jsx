
import './footer.scss';
import { AiOutlineCopyright } from 'react-icons/ai';

const Footer = () => {
    return (
        <div className='footer grid'>
            <p className='grid'>
                <AiOutlineCopyright /> 2023 | <a href='#'>biddit.com</a> All Rights reserved
            </p>
        </div>
    );
}

export default Footer;

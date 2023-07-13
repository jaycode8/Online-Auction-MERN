
import './landing.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import Auction from './auction';

import img1 from '../../assets/imgs/01.jpg';
import img3 from '../../assets/imgs/03.jpg';
import img4 from '../../assets/imgs/04.jpg';
import img5 from '../../assets/imgs/05.jpg';
import img7 from '../../assets/imgs/07.jpg';



const Landing = () => {
    return (
        <div className='homePage grid'>
            <section>
                <Swiper
                    modules={[ Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2500 }}
                    loop
                    className='swiper'
                >
                    <SwiperSlide className='swiperSlide'>
                        <img src={img4} alt='img_cover'/>
                        <span className='grid'>
                            <h1>Biddit.com</h1>
                            <h2>Do you have something to sell</h2>
                        </span>
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={img3} alt='img_cover' />
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={img5} alt='img_cover' />
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={img7} alt='img_cover' />
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={img1} alt='img_cover' />
                    </SwiperSlide>
                </Swiper>
            </section>
            <Auction/>
        </div>
    );
}

export default Landing;

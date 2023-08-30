
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination, Scrollbar, A11y, Navigation } from 'swiper';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link, useParams } from 'react-router-dom';
import { GiAlarmClock } from 'react-icons/gi';
import { VscLocation } from 'react-icons/vsc';
import { RxCross1 } from 'react-icons/rx';
import { GrSend } from 'react-icons/gr';
import { AiFillMessage } from 'react-icons/ai';
import axios from 'axios';
import Swal from 'sweetalert2';

const url_api = import.meta.env.VITE_REACT_APP_URL;
const sessionToken = localStorage.getItem('sessionToken');

const SingleItem = () => {
    const { id } = useParams();
    const [bidList, setBidList] = useState([]);
    const [item, setItem] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [msg, setMsg] = useState('');
    const [bid, setBid] = useState({
        address: '',
        amount: '',
        item: id
    });
    const [highestBid, setHighestBid] = useState('');

    const fetchItemById = async () => {
        try {
            const res = await axios(`${url_api}/item/${id}`);
            setItem(res.data.item);
            setPhotos(res.data.item.itemPhotos);
        } catch (error) {
            console.log(error);
        };
    };

    const fetchBids = async () => {
        try {
            const res = await axios(`${url_api}/item/${id}/bids`);
            setBidList(res.data.bids);
            setHighestBid(res.data.high_bid)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchItemById();
        fetchBids();
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setBid({ ...bid, [input.name]: input.value });
    };

    const confirmBidPlacement = (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'BIDDIT.COM',
            text: `Confirm placing a bid of ksh.${bid.amount} on ${item.prodTitle}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, place bid'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit();
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: `${url_api}/item/${id}/bids`,
                data: bid,
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });
            setMsg(res.data);
            if (res.data.success == 'true') {
                window.location.reload(true);
            }
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    };

    const myModal = () => {
        document.querySelector('.modal').classList.toggle('open-modal');
    };

    // ------------------ formating the date string
    let dateStr = item.time;
    const dt = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = dt.toLocaleDateString('en-US', options);

    //  -------------------- getting remaining days to auction end
    let currentDate = new Date();
    const futureDay = new Date(dateStr);
    const timeDiff = futureDay - currentDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let remaining_time

    timeDiff >= 1 ? (
        remaining_time = `${days} days ${hours} hours ${minutes} minutes`
    ) :
        (
            remaining_time = `${Math.abs(days)} days `
        )

    function getCurrentTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var time = hours + ":" + minutes + " " + ampm;
        return time;
    }

    function sendMessage() {
        var input = document.getElementById("input");
        var message = input.value;
        input.value = "";

        var chatbox = document.getElementById("chatbox");
        var newMessage = document.createElement("div");
        newMessage.className = "message";

        var span = document.createElement("span");
        newMessage.appendChild(span);

        var messageContainer = document.createElement("div");
        messageContainer.className = "msgContainer";
        newMessage.appendChild(messageContainer);

        var content = document.createElement("p");
        content.className = "content";
        content.textContent = message;
        messageContainer.appendChild(content);

        var timestamp = document.createElement("p");
        timestamp.className = "timestamp";
        timestamp.textContent = getCurrentTime();
        messageContainer.appendChild(timestamp);

        chatbox.appendChild(newMessage);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    const toggleMsg = () => {
        document.querySelector('.text-sms').classList.toggle('messageBoxActive')
    };
    //bidList == undefined ? console.log('none') : console.log('items')
    //console.log(bidList)

    return (
        <div className='singleItem'>
            <div className='modal'>
                <div className='bid grid'>
                    <p className={`msg ${msg.success}`}>{msg.msg}</p>
                    <RxCross1 className='close' onClick={() => myModal()} />
                    {
                        timeDiff >= 1 ?
                            <section>
                                <form className='bid-form grid' onSubmit={() => confirmBidPlacement(event)}>
                                    <input
                                        type='text'
                                        placeholder='Physical Address'
                                        name='address'
                                        required
                                        onChange={handleChange}
                                    />
                                    <input
                                        type='number'
                                        placeholder='Bid Amount'
                                        name='amount'
                                        required
                                        onChange={handleChange}
                                    />
                                    <input
                                        type='Submit'
                                        value='Submit Bid'
                                    />
                                </form>
                                <div className="bidersList grid">
                                    <h4>bidders</h4>
                                    {
                                        bidList ? (

                                            <table>
                                                <tr>
                                                    <th>name</th>
                                                    <th>amount(ksh.)</th>
                                                    <th>address</th>
                                                </tr>
                                                {
                                                    bidList.map(list => (
                                                        <tr>
                                                            <td>{list.user.user_name}</td>
                                                            <td>{list.amount}</td>
                                                            <td>{list.address}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </table>) : (
                                            <p style={{ marginTop: '1rem' }}>No bidders yet</p>
                                        )
                                    }
                                </div>
                            </section>
                            :
                            <div>
                                <div className="bidersList grid">
                                    <h4>bidders</h4>
                                    {
                                        bidList ? (

                                            <table>
                                                <tr>
                                                    <th>name</th>
                                                    <th>amount(ksh.)</th>
                                                    <th>address</th>
                                                </tr>
                                                {
                                                    bidList.map(list => (
                                                        <tr>
                                                            <td>{list.user.user_name}</td>
                                                            <td>{list.amount}</td>
                                                            <td>{list.address}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </table>) : (
                                            <p style={{ marginTop: '1rem' }}>No bidders yet. Bid session might reopen soon.</p>
                                        )
                                    }
                                </div>
                            </div>
                    }

                </div>
            </div>
            <div className='itemDescriptions grid'>
                <div className='text-sms'>
                    <div className="sms-container">
                        <section>
                            <div className='chats'>
                                <div id="chatbox"></div>
                            </div>
                            <div className='utils'>
                                <textarea id='input' placeholder='message'></textarea>
                                <button onClick={() => sendMessage()}>
                                    <GrSend className='send' />
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
                <AiFillMessage className='msg_icon' onClick={() => toggleMsg()} />
                {
                    bidList ? <>
                        <div className='highestBid'>
                            high bid
                            <p>ksh. {highestBid}</p>
                        </div>
                    </> : <>
                        <div className='highestBid nobid'>
                            <p>item was not pachased and bid sesion might be back soon</p>
                        </div>
                    </>
                }

                <div className='col-1 grid'>
                    <div className='grid'>
                        <h1>{item.prodTitle}</h1>
                        <p>ID: {item._id}</p>
                        <p>cordinator: {item.owner}</p>
                        <span>
                            <GiAlarmClock />
                            {
                                timeDiff >= 1 ? <p>ends in {remaining_time}</p> : <p style={{ color: 'red' }}>ended in past {remaining_time}</p>
                            }
                        </span>
                        <span>
                            <VscLocation />
                            <p>{item.address}</p>
                        </span>
                        {
                            timeDiff >= 1 ? <>
                                {/* <button
                                    className='btn'
                                    onClick={() => myModal()}
                                >
                                    place bid
                                </button> */}
                                <button
                                    className='btn'
                                    onClick={() => myModal()}
                                >
                                    participate bid
                                </button>
                            </>
                                :
                                <button
                                    className='btn'
                                    onClick={() => myModal()}
                                >
                                    Sold out view bidders
                                </button>
                        }
                    </div>
                </div>
                <div className='col-2 grid'>
                    <div className='item-pic'>
                        <Swiper
                            modules={[Pagination, Scrollbar, A11y, Autoplay, Navigation]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 2500 }}
                            loop
                            className='swiper'
                        >
                            {
                                photos.map((pic, index) => (
                                    <SwiperSlide className='swiperSlide' key={index}>
                                        <img src={`${url_api}/uploads/${pic}`} alt={`${item.prodTitle}`} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                    <div className='item-data'>
                        <p>Address:</p>
                        <p>{item.address}</p>
                        <div className='terms grid'>
                            <h3>Terms and Conditions</h3>
                            <p>By placing a bid, you accept all of the following Terms and Conditions of Sale and the Terms and Conditions of Service.</p>
                            <strong>
                                PLEASE READ THESE TERMS AND CONDITIONS OF SALE AND THE TERMS AND CONDITIONS OF SERVICE PRIOR TO EACH BID
                            </strong>
                            <span>
                                <h4>CLOSE OF RESERVE AUCTION</h4>
                                <p>
                                    This reserve auction shall end at 7:00 pm on <em>{formattedDate}</em>; provided, however, that
                                    this reserve auction will close using an extended bidding format. This feature allows the
                                    auction to function like a live auction by extending the time for (3) minutes
                                    (or by such other time as Biddit determines in its sole discretion) on any item that has
                                    active bidding within the last three minutes of that item closing. It also allows customers
                                    with slower computer connections a fair opportunity to bid by eliminating the bidders that use
                                    computer sniping software to place bids within the last second of an auction out bidding you.
                                </p>
                            </span>

                            <span>
                                <h4>SALES TAX</h4>
                                <p>
                                    7.125% MN Sales Tax will be charged unless you have a MN sales tax or Agricultural exempt form (ST3) on file with us.
                                </p>
                            </span>
                            <span>
                                <h4>BUYER'S FEE OR PREMIUM</h4>
                                <p>
                                    A buyer's fee or premium is charged on each item as follows:
                                    <ul>
                                        <li>15% buyer's fee on all bids</li>
                                    </ul>
                                </p>
                            </span>
                            <span>
                                <h4>PAYMENT TERMS</h4>
                                <p>
                                    Cash, Cashier's Check & Bank Wire only. NO PERSONAL OR BUSINESS CHECKS, CREDIT OR DEBIT CARDS. ANY
                                    TRANSACTIONS OVER $9,999.00 MUST BE PAID FOR WITH CASHIERS CHECK OR BANK WIRE ONLY.
                                </p>
                                <p>
                                    All Cashier's Checks will be verified by the Financial Institution upon which they are drawn.
                                    No items will be released until the entire invoice is paid in full.
                                </p>
                                <p>
                                    New bidders need to register a credit card as a form of identification. Your credit card
                                    will be charged $1 to verify your identity and shortly thereafter refunded.
                                </p>
                            </span>
                            <span>
                                <h4>PLEASE NOTE</h4>
                                <p>
                                    Invoices are delivered via email by noon on the day following the close of the auction.
                                    Neither the Seller nor the Werner Auction Group (the “Auctioneer” or “Biddit”) provide
                                    transportation or shipping services for a buyer to remove an item won at an auction. Transportation or
                                    shipping services are a buyer's sole responsibility. Therefore, any and all methods of towing and/or
                                    hauling and any other method or requirements for the removal or transport of an item is the sole
                                    responsibility of the buyer.
                                    All items must be picked up at the auction address, FOB.
                                    ALL DESCRIPTIONS AND CONDITIONS INDICATED ARE NOT GUARANTEED. PLEASE READ THE TERMS AND CONDITIONS OF
                                    SERVICE FOR MORE DETAILS AND PRIOR TO EACH BID.
                                    ALL ITEMS ARE SOLD AS IS, WHERE IS, WITH ALL FAULTS AND WITH NO WARRANTY EXPRESSED OR IMPLIED. Biddit IS
                                    NOT RESPONSIBLE FOR ACCIDENTS. PLEASE READ THE TERMS AND CONDITIONS OF SERVICE FOR MORE DETAILS.
                                </p>
                                <p>
                                    Biddit strongly RECOMMENDS THAT ALL BIDDERS Make the Time to VIEW ITEMS BEFORE PLACING BIDS!
                                    This auction is being coordinated by “Big Deal Consignments.”. All descriptions & conditions indicated
                                    are deemed reliable but not guaranteed. “Big Deal Consignments.” is responsible for scheduling inspection
                                    & pickup times. The collection & disbursement of all funds, including but not limited to sales tax, buyers
                                    fees & payments to sellers are the sole responsibility of “Big Deal Consignments.”.
                                    They are solely responsible to provide Titles, Bill of Sale and any other documents to the Buyer with
                                    respect to items purchased. On this auction Biddit is solely acting as a marketing agent.
                                </p>
                            </span>
                        </div>
                        <h3>Auction ID: {item._id}</h3>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default SingleItem;


import { Route, Routes } from 'react-router-dom';
import './App.scss'
import Footer from './pages/footer/footer';
import Landing from "./pages/landingPage/landing";
import Nav from "./pages/navBar/nav";
import Items from './pages/Items/items';
import SingleItem from './pages/Items/singleItem';
import Accounts from './pages/accounts/accounts';
import NewAuction from './pages/newAuction/newAuction';
import Otp from './pages/accounts/otp';
import PastItems from './pages/Items/pastItems';
import MyItems from './pages/Items/myItems';
import MyItemsModify from './pages/Items/myItems-modify';
import ModifyAuction from './pages/newAuction/modify';
import Admin from './pages/Admin/admin';
import EditAccount from './pages/accounts/editAccount';

const App = () => {
    return (
        <div className="App">
            <Nav />
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/auctions' element={<Items />} />
                <Route path='/item/:id' element={<SingleItem />} />
                <Route path='/acc' element={<Accounts />} />
                <Route path='/editAcc/:id' element={<EditAccount/>} />
                <Route path='/newAuction' element={<NewAuction />} />
                <Route path='/verify' element={<Otp />} />
                <Route path='/ended' element={<PastItems />} />
                <Route path='/myItems' element={<MyItems />} />
                <Route path='/itemsModify' element={<MyItemsModify />} />
                <Route path='/update/:id' element={<ModifyAuction />} />
                <Route path='/admin' element={<Admin/>} />
            </Routes>
            <Footer/>
        </div>
    )
};

export default App;
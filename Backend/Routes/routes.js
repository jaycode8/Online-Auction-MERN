const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtKey = process.env.SecreteKey;
const mongoose = require('mongoose');
const {
    userSchema,
    itemSchema,
    bidSchema
} = require('../MODELS/auctions.models');
const usersModel = mongoose.model('users', userSchema);
const itemModel = mongoose.model('items', itemSchema);
const bidModel = mongoose.model('bid', bidSchema);
require('../MODELS/db');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const salt_rounds = 10;
require('dotenv').config();
const nodemailer = require('nodemailer');

let OTP, user;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.originalname.split('.')[0]}-auction_item.${ext}`);
    }
});
let upload = multer({ storage: storage });

const verifyToken = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1]
    try {
        if (!accessToken) {
            return res.status(400).json({ success: 'false', msg: 'please sign in first' });
        } else {
            const validateToken = await jwt.verify(accessToken, jwtKey);
            if (validateToken) {
                req.authenticated = true;
                req.id = validateToken // this is the information response of the user sent to client
                return next()
            }
        }
    } catch (error) {
        if (accessToken.length < 5) {
            return res.status(400).json({ success: "false", msg: "please sign in first", state: "uptodate" })
        } else {
            return res.json({ success: 'false', msg: 'Token has expired.... please sign in', state: "expired" })
        }
    }
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});

// ================== creating an admin user ======================
const createSystemAdmin = async () => {
    try {
        const admin = await usersModel.findOne({ isAdmin: true });
        if (!admin) {
            const hashed_password = await bcrypt.hash("admin", salt_rounds);
            const Admin = new usersModel({
                email: "admin.app@gmail.com",
                user_name: "admin",
                phone: "0700000000",
                password: hashed_password,
                isAdmin: true
            });
            await Admin.save();
            console.log('An admin has been successfully been created');
        }
    } catch (error) {
        console.error('An error occured while creating an Admin');
    }
};
createSystemAdmin();

const createDummyAccount = async () => {
    try {
        const dummyAccount = await usersModel.findOne({ user_name: 'test' });
        if (!dummyAccount) {
            const hashed_password = await bcrypt.hash("test", salt_rounds);
            const dummyUser = new usersModel({
                email: "test.app@gmail.com",
                user_name: "test",
                phone: "07111111",
                password: hashed_password
            });
            await dummyUser.save();
            console.log('A dummy user account has been successfully created');
        }
    } catch (error) {
        console.error('An error occured while creating an dummy account');
    }
};
createDummyAccount();


// =========================== Users Routes =============================

router.get('/', verifyToken, async (req, res) => {
    try {
        res.json({ success: "true", msg: "Hi the API's has been successfully been deployed" });
    } catch (error) {
        res.json({ success: "false", msg: "fatal error...." });
    }
});

router.post('/users', async (req, res) => {
    try {
        const exist_email = await usersModel.findOne({ email: req.body.email });
        if (exist_email == null) {
            const exist_username = await usersModel.findOne({ user_name: req.body.user_name });
            if (exist_username == null) {
                const exist_phone = await usersModel.findOne({ phone: req.body.phone });
                if (exist_phone == null) {
                    let digits = "0123456789";
                    OTP = "";
                    for (let i = 0; i < 4; i++) {
                        OTP += digits[Math.floor(Math.random() * 10)];
                    };
                    const hashed_password = await bcrypt.hash(req.body.password, salt_rounds);
                    req.body.password = hashed_password
                    user = new usersModel(req.body);
                    const mailOPtion = {
                        from: 'mr.jaymoh017@gmail.com',
                        to: req.body.email,
                        subject: 'Account verification',
                        text: `${OTP} is your code for verification for a biddit account.`
                    }
                    const infor = await transporter.sendMail(mailOPtion);
                    res.json({ success: 'true', msg: 'sending an OTP code message......' });
                } else {
                    res.json({ success: 'false', msg: 'Phone number already used' });
                }
            } else {
                res.json({ success: 'false', msg: 'Username already exists' });
            }
        } else {
            res.json({ success: 'false', msg: 'Email already exists' });
        }
    } catch (error) {
        res.json({ success: 'false', msg: error.message });
    };
});

router.post('/verify', async (req, res) => {
    try {
        const otp_num = req.body.otp;
        if (OTP == otp_num) {
            await user.save();
            res.json({ success: 'true', msg: 'otp correct', otp: otp_num });
        } else {
            res.json({ success: 'false', msg: 'OTP code incorrect' });
        }
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const foundUser = await usersModel.findOne({ user_name: user.userName });
        if (foundUser) {
            const password_match = await bcrypt.compare(req.body.password, foundUser.password)
            if (password_match == true) {
                let tokens = await jwt.sign({ user: foundUser._id }, jwtKey, { expiresIn: 60 * 60 * 12 });
                res.json({ success: "true", msg: "Successfully loged in", token: tokens, loggedUser: foundUser });
            } else {
                res.json({ success: "false", msg: "Password is incorrect" });
            }
        } else {
            res.json({ success: "false", msg: "User name does not exist" });
        }
    } catch (error) {
        res.json({ success: "false", msg: "User does not exist" });
    }
});

router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = req.id.user;
        const user_data = await usersModel.findOne({ _id: user });
        res.json({ success: "true", msg: "User successfully fetched", user: user_data });
    } catch (error) {
        res.json({ success: "false", msg: "fatal error...." });
    }
});

router.patch('/user/:id', verifyToken, async (req, res) => {
    try {
        const user = req.id.user;
        const updated_user = await usersModel.findByIdAndUpdate(user, req.body);
        res.json({ success: "true", msg: "User successfully updated", user: updated_user });
    } catch (error) {
        res.json({ success: "false", msg: "fatal error...." });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await usersModel.find();
        res.json({ success: "true", msg: "Successfully fetched list of users", users: users });
    } catch (error) {
        res.json({ success: "false", msg: "fatal error...." });
    }
});

router.delete('/user/:id', verifyToken, async (req, res) => {
    try {
        await usersModel.deleteOne({ _id: req.params.id });
        res.json({ success: "true", msg: "Successfully deleted the user" });
    } catch (error) {
        res.json({ success: "false", msg: "An error occured user is not deleted" });
    }
});

// ================================ auction items routes 

router.post('/items', upload.array('itemPhotos', 10), verifyToken, async (req, res) => {
    try {
        const loggedUser = req.id.user;
        const files = req.files;
        if (files) {
            let file_names = []
            files.forEach(file => {
                file_names.push(file.filename);
            });
            req.body.itemPhotos = file_names;
            req.body.uploder = loggedUser;
            const new_item = new itemModel(req.body);
            await new_item.save();
            const user = await usersModel.findById(loggedUser);
            user.postedItems.push(new_item);
            await user.save();
            res.json({ success: 'true', msg: 'Item was succesfully uploaded' });
        } else {
            res.json({ success: 'false', msg: 'A file must be uploaded' });
        }
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.get('/items', async (req, res) => {
    try {
        const items_list = await itemModel.find().populate('uploder').sort({ time: -1 });
        res.json({ success: 'true', msg: 'array of all items', items: items_list });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.get('/item/:id', async (req, res) => {
    try {
        const item_id = req.params.id;
        const item = await itemModel.findOne({ _id: item_id });
        res.json({ success: 'true', msg: 'The fetched successfully', item: item });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.get('/myItems', verifyToken, async (req, res) => {
    try {
        const user = req.id.user;
        const items = await itemModel.find({ uploder: user });
        res.json({ success: 'true', msg: 'array of all items', items: items });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.put('/item/:id', upload.array('itemPhotos', 10), verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const loggedUser = req.id.user;
        const files = req.files;
        let file_names = []
        files.forEach(file => {
            file_names.push(file.filename);
        });
        req.body.itemPhotos = file_names;
        req.body.uploder = loggedUser;
        await itemModel.findByIdAndUpdate(id, req.body);
        res.json({ success: 'true', msg: 'item successfully updated', 'file': req.files, 'item': req.body });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.patch('/item/:id', upload.array('itemPhotos', 10), verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const loggedUser = req.id.user;
        req.body.uploder = loggedUser;
        await itemModel.findByIdAndUpdate(id, req.body);
        res.json({ success: 'true', msg: 'item successfully updated', 'item': req.body });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.post('/item/:id/bids', verifyToken, async (req, res) => {
    try {
        const user = req.id.user;
        const { address, amount, item } = req.body;
        const bid = new bidModel({ user, address, amount, item });
        await bid.save()
        const found_item = await itemModel.findOne({ _id: item });
        found_item.bidders.push(user);
        const found_user = await usersModel.findOne({ _id: user });
        found_user.bids.push(bid._id)
        res.json({ success: 'true', msg: 'bid successfully placed', item: found_item, user: user, bid: bid });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.get('/item/:id/bids', async (req, res) => {
    try {
        const itemId = req.params.id;
        const bids = await bidModel.find({ item: itemId }).sort({ amount: -1 }).populate('user');
        const sorted_bids = bids.sort((a, b) => b.amount - a.amount);
        const highestBidsMap = new Map();
        for (const bid of sorted_bids) {
            const userId = bid.user._id;
            if (!highestBidsMap.has(userId)) {
                highestBidsMap.set(userId, bid)
            }
        };
        const grouped_bids = Array.from(highestBidsMap.values());
        res.json({ success: 'true', msg: 'bid lists', high_bid: bids[0].amount, bids: grouped_bids });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.post('/accept', async (req, res) => {
    try {
        const item = await itemModel.findOne({ _id: req.body.item_id });
        item.accepted = true;
        await item.save();
        res.json({ success: 'true', msg: 'item accepted' });
    } catch (error) {
        res.json({ success: 'false', msg: 'An error occured' });
    }
});

router.delete('/item/:id', verifyToken, async (req, res) => {
    try {
        const item = await itemModel.findOne({ _id: req.params.id });
        for (let i = 0; i < item.itemPhotos.length; i++) {
            fs.unlinkSync(`./public/uploads/${item.itemPhotos[i]}`);
        }
        await itemModel.remove({ _id: req.params.id });
        res.json({ success: "true", msg: "Successfully deleted item" });
    } catch (error) {
        res.json({ success: "false", msg: "An error occured item is not deleted" });
    }
});



module.exports = router;

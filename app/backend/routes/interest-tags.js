import express from 'express'
import User from '../models/User.js'
import Tag from '../models/Tag.js'
import dotenv from 'dotenv'

const router = express.Router();
dotenv.config()

router.get('/', async(req, res) => {

})

export default router;

import express from 'express'
import User from '../models/User.js'
import Tag from '../models/Tag.js'
import dotenv from 'dotenv'

const router = express.Router();
dotenv.config()

//Endpoint for getting all interest tags, so that users can select from these fixed tags
router.get('/', async(req, res) => {
    try
    {
        const {tags} = req.body;
        console.log(`Requested tags ${tags}`);

        const existingUser = await User.findOne({ucfEmail});
        
        for (const tag of tags){
            
        }



    }

    catch(error)
    {
        res.status(500).json({"message": "Failed to fetch all tags"})

    }



})

export default router;
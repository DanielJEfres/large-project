import express from 'express'
import mongoose from 'mongoose'
import eventModel from '../models/Event.js'
import organizationModel from '../models/Organization.js'

const router = express.Router()

router.get('/getUpcoming{/:organizationId}', async(req, res)=>{
    try{

        const today = new Date()

        const query = {
            startDate:{$gte:today}
        }

        if(req.params.organizationId){
            query.organizationId = new mongoose.Types.ObjectId(req.params.organizationId)
        }

        const events = await eventModel.find(query)

        return res.status(200).json({events:events})

    }catch(error)
    {
        res.status(500).json({message: "Could Not Get Events"})
    }

})

router.get('/getByTag{/:tagId}', async(req, res)=>
    {
        try{
            if(!req.params.tagId){
                return res.status(400).json({message: "Tag ID required"})
            }
            const events = await eventModel.find({tags: new mongoose.Types.ObjectId(req.params.tagId)})
            return res.status(200).json({events})
        }catch(error)
        {
            return res.status(500).json({message: "Could Not Get Tag"})
        }
    }
)

router.get('/searchEvent', async(req, res)=>
    {
        try{
            const { q } = req.query;
            if(!q)
            {
                return res.status(400).json({error: 'Search query parameter "q" is required '})
            }

            const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const events = await eventModel.find({title: new RegExp(escaped, 'i')})
            return res.status(200).json({events})

        }catch(error){
            res.status(500).json({message: "Could Not Search Events"})
        }
    }

)
router.get('/getTrending', async(req, res)=>
    {
        try
        {
            const today = new Date()
            const trending = await eventModel.aggregate([
                { $match: { startDate: { $gte: today } } },
                { $addFields: { attendeeCount: { $size: '$attendees' } } },
                { $sort: { attendeeCount: -1 } },
                { $limit: 10 }
            ])
            return res.status(200).json({ events: trending })

        }catch(error)
        {
            res.status(500).json({message : "Could Not Get Trending Events"})
        }
    }
)

export default router
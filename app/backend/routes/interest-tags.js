import express from 'express'
import User from '../models/User.js'
import Tag from '../models/Tag.js'
import Event from '../models/Event.js'
import dotenv from 'dotenv'

const router = express.Router();
dotenv.config()


//Get Tags: fetches all existing tags from database
router.get("/getTags", async(req, res) => {
    try {
        const tags = await Tag.find()

        if(!tags) return res.status(500).json({message: "Could Not Get Tags"})

        return res.status(200).json({tags:tags})

    } catch(error) {

        console.log(error)
        res.status(500).json({message:"Failed to fetch all tags"})
    }
})

//Get tags for user
router.get("/:userId", async(req, res) => {
    try {

        const userId = req.params.userId

        const interests = await User.findById(userId).select("interests").populate("interests firstName lastName")

        return res.status(200).json({interests:interests})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Failed to fetch interests from user"})
    }
})

//Add Tag (User): add tag to user's tag array
router.put("/user/:userId", async(req, res) => {
    try {
        const { interests } = req.body

        const lowerInterests = interests.map((n) => n.toLowerCase())
        const tags = await Tag.find({ name: { $in: lowerInterests } }).select('_id')
        const tagIds = tags.map(t => t._id)
        if (tagIds.length === 0) return res.status(404).json({ message: "No matching tags found" })

        const user = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { interests: { $each: tagIds } } },
            { returnDocument: 'after' }
        )

        if(!user) return res.status(400).json({message:"Could not get user for interests"})

        return res.status(200).json({message:"interests added"})

    } catch(error) {
        console.log(error)
        res.status(500).json({message:"Could not add interests to user"})
    }
})

//Add Tag (Event): add tag to Event's tag array
router.put("/event/:eventId", async(req, res) => {
    try {
        const {tags} = req.body

        const event = await Event.findByIdAndUpdate(
            {_id:req.params.eventId},
            { $addToSet: { tags: { $each: tags} } },
            {returnDocument: 'after'}
        )

        if(!event) return res.status(400).json({message:"Could not get event for tag"})

        return res.status(200).json({message:"tags added"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Could not add tags to event"})
    }
})

//Delete tag (User): delete tag from user's tag array
router.delete("/user/:userId", async(req, res) => {
    try {
        const { interests } = req.body

        const lowerInterests = interests.map((n) => n.toLowerCase())
        const tags = await Tag.find({ name: { $in: lowerInterests } }).select('_id')
        const tagIds = tags.map(t => t._id)
        if (tagIds.length === 0) return res.status(404).json({ message: "No matching tags found" })

        const user = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                { $pull: { interests: { $in: tagIds } } },
                { returnDocument: 'after' }
            )

        if(!user) return res.status(400).json({message:"Could not get user for interests"})

        return res.status(200).json({message:"interests deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Could not add interests to user"})
    }
})

//Delete tag (Event): delete tag to Event's tag array
router.delete("/event/:eventId/", async(req, res) => {
   try {
        const {tags} = req.body
        
        const event = await Event.findByIdAndUpdate(
                {_id:req.params.eventId},
                { $pull: { tags: { $in: tags } } },
                {returnDocument: 'after'}
            )

        if(!event) return res.status(400).json({message:"Could not get event for tag"})

        return res.status(200).json({message:"tags deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Could not add tags to event"})
    }
})

export default router;
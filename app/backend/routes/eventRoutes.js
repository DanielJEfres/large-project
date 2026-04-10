/* Event Schema
title -- required
description
location 
startDate -- required
endDate
organizationId
createdBy (User ID) -- required
tags (Tag IDs, think like sports or computer science)
isRSO (true = RSO event tab, false = student event tab) -- required
flyer (I’d have to setup an S3 but should be ez with our current arch, optional)
status (upcoming / ongoing / cancelled / completed)
isPublic
rsvpEnabled (bool)
timestamps
*/

import  express from 'express'
import mongoose from 'mongoose'
import Event from '../models/Event.js'
import User from '../models/User.js'
import Tag from '../models/Tag.js'
import { upload,uploadToS3 } from '../middleware/upload.js'

const router = express.Router();

//Get Event
router.get('/:eventId', async (req, res) => {

    try {
        let tags = []
        
        const event = await Event.findById(req.params.eventId)
       
        if(!event) return res.json(500).json({message: "No Event Found"})
        
        const eventCreator = await User.findById(event.createdBy).select('firstName lastName')
        
        //Get tag names
        if(event.tags && event.tags.length > 0) {
            for(let tag of event.tags) {
                tag = await Tag.findById(tag).select('name')
                tags.push(tag)
            }
        }

        //Update field information
        event.createdBy = eventCreator
        event.tags = tags

        return res.status(200).json({event:event})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:" Could Not Get Event"})
    }
})

// Add event to user and add attendee to Event (onclick button)
router.patch('/attendEvent/:eventId', async(req, res)=>
    {
        try {
            const userId = req.body.userId
            const eventId = req.params.eventId

            if(!userId) return res.status(400).json({ message: "userId is required" })

            const event = await Event.findById(eventId)
            if(!event) return res.status(404).json({ message: "Event not found" })

            if(event.rsvpEnabled && event.rsvpLimit !== null && event.attendees.length >= event.rsvpLimit)
                return res.status(400).json({ message: "Event is full" })

            if(event.attendees.includes(userId))
                return res.status(400).json({ message: "User already attending this event" })

            await Event.updateOne({ _id: eventId }, { $push: { attendees: new mongoose.Types.ObjectId(userId) } })
            await User.updateOne({ _id: userId }, { $push: { user_events: new mongoose.Types.ObjectId(eventId) } })

            return res.status(200).json({ message: "RSVP successful" })

        } catch(error) {
            console.log(error)
            res.status(500).json({ message: "Could not RSVP" })
        }
    }
)

router.patch('/unattendEvent/:eventId', async(req, res)=>
    {
        try
        {
            const userId = req.body.userId
            const eventId = req.params.eventId

            if(!userId) return res.status(400).json({ message: "userId is required" })

            const event = await Event.findById(eventId)
            if(!event) return res.status(404).json({ message: "Event not found" })
            
            if(event.attendees.length==0)
            {
                return res.status(400).json({message: "Event does not have any attendees"})
            }
            if (!(event.attendees.includes(userId)))
            {
                return res.status(400).json({message: "User is not in attendees list"})
            }

            await Event.updateOne({ _id: eventId }, { $pull: { attendees: new mongoose.Types.ObjectId(userId) } })
            await User.updateOne({ _id: userId }, { $pull: { user_events: new mongoose.Types.ObjectId(eventId) } })
            return res.status(200).json({ message: "Successful update of RSVP" })

        }
        catch(error)
        {
            console.log(error)
            res.status(500).json({message:"could not Update attendance"})
        }
    }

)
//delete event from an user history and attendee from event

//Create Event
router.post('/', upload.single('flyer'), async (req, res) => {
    try {
        const { title, description, location, startDate, endDate, organizationId,
                createdBy, tags, isRSO, status, isPublic, rsvpEnabled } = req.body
        
        if( !title || !startDate || !createdBy ) return res.status(400).json({error:"Required Fields Missing"})
        if( endDate && (startDate == null || new Date(endDate) <= new Date(startDate)) ) return res.status(400).json({error:"End date must be after start date"})
        
        let flyerUrl = null;
        if (req.file) {
            flyerUrl = await uploadToS3(req.file, 'flyers');
        }

        let tagNames = [];
        if (tags) {
            tagNames = Array.isArray(tags) ? tags : [tags];
        }
        const foundTags = await Tag.find({ name: { $in: tagNames } });
        const tagIds = foundTags.map(t => t._id);

        const event = await Event.create({
            title, description, location, 
            startDate, endDate, organizationId, 
            createdBy, tags: tagIds, isRSO: isRSO === 'true', status, isPublic, 
            flyer: flyerUrl, rsvpEnabled: rsvpEnabled === 'true'
        })
        if(!event) return res.json({message: "Could Not Add Event"})
        return res.status(201).json({Event:event})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Event Not Created"})
    }
})

//Update Event
router.put('/:eventId', upload.single('flyer'), async (req, res) => {

    try {
        const updateData = { ...req.body };
        if(req.file) {
            const flyerUrl = await uploadToS3(req.file, 'flyers')
            
            const updateEventFlyer = await Event.findByIdAndUpdate(
                {_id: req.params.eventId},
                {flyer: flyerUrl},
                {returnDocument: 'after'}
            )

            if(!updateEventFlyer) return res.status(400).json({message:"Could Not Upload Flyer"})
        }

        if (updateData.tags) {
            const tagNames = Array.isArray(updateData.tags) ? updateData.tags : [updateData.tags];
            const foundTags = await Tag.find({ name: { $in: tagNames } });
            // convert names to ObjectIds
            updateData.tags = foundTags.map(t => t._id);
        }
      
        const updatedEvent = await Event.findOneAndUpdate(
            {_id: req.params.eventId},
            updateData,
            {returnDocument: 'after'}
        )

        if (!updatedEvent) return res.status(400).json({message: "Could Not Update Event"})

        return res.status(200).json({Event:updatedEvent})

    } catch(error) {

        console.log(error)
        res.status(500).json({message:"Could Not Update Event"})
    }
})

//Delete Event
router.delete('/:eventId', async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete({_id: req.params.eventId})

        if(!event) return res.status(500).json({message:"Could Not Delete Event"})

        return res.status(200).json({message:"Event Deleted"})

    } catch (error) {

        console.log(error)
        res.status(500).json({message:"Could Not Delete Event"})
    }
})

//Get all events a specific user is attending
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const events = await Event.find({ attendees: userId });

        if (!events) {
            return res.status(200).json([]);
        }

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({ message: "Could not fetch your events" });
    }
});

//Get all events a specific user CREATED
router.get('/created-by/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Filters events where the 'createdBy' field matches the user's ID
        const events = await Event.find({ createdBy: userId });

        if (!events || events.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching created events:", error);
        res.status(500).json({ message: "Could not fetch your created events" });
    }
});

export default router
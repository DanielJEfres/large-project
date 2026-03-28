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
import eventModel from '../models/Event.js'
import organizationModel from '../models/Organization.js'

const router = express.Router();

//Get Event
router.get('/:eventId', async (req, res) => {

    try {

        const event = await eventModel.findById(req.params.eventId)
       
        if(!event) return res.json(500).json({message: "No Event Found"})
        
        return res.status(200).json({event:event})

    } catch (error) {
        res.status(500).json({message:" Could Not Get Event"})
    }
})

//Get All Events Created By An Organization
router.get('/org/:organizationId', async (req, res) => {
    try {

        const orgEvents = await eventModel.find(
            {
                organizationId: new organizationModel.base.Types.ObjectId(req.params.organizationId)
            })
        
        return res.status(200).json({org_events:orgEvents})

    } catch (error) {
        console.log(error)
    }
})

//Create Event
router.post('/', async (req, res) => {

    try {
        
        const { title, description, location, startDate, endDate, organizationId,
                createdBy, tags, isRSO, /*flyer,*/ status, isPublic, rsvpEnabled } = req.body
        
            
        //Check for required fields        
        if( !title || !startDate || !createdBy ) return res.status(400).json({error:"Required Fields Missing"})

        //Check for create Date
        if( endDate && (startDate == null || new Date(endDate) <= new Date(startDate)) ) return res.status(400).json({error:"End date must be after start date"})
        
        const event = await eventModel.create({
            title, description, location, 
            startDate, endDate, organizationId, 
            createdBy, tags, isRSO, status, isPublic, 
            rsvpEnabled
        })

        if(!event) return res.json({event: "Could Not Add Event"})
        
        return res.status(201).json({event:event})

    } catch(error) {

        console.log(error)
        res.status(500).json({message: "Event Not Created"})
    }
})

//Update Event
router.put('/:eventId', async (req, res) => {

    try {
        
        const updatedEvent = await eventModel.findByIdAndUpdate(
            {_id: req.params.eventId},
            req.body,
            {returnDocument: 'after'}
        )

        if(!updatedEvent) return res.status(500).json({message:"Could Not Update Event"})

        return res.status(200).json({event:updatedEvent})

    } catch(error) {

        console.log(error)
        res.status(500).json({message:"Could Not Update Event"})
    }
})

//Delete Event
router.delete('/:eventId', async (req, res) => {

    try {

        const event = await eventModel.findByIdAndDelete({_id: req.params.eventId})

        if(!event) return res.status(500).json({message:"Could Not Delete Event"})

        return res.status(200).json({message:"Event Deleted"})

    } catch (error) {

        console.log(error)
        res.status(500).json({message:"Could Not Delete Event"})
    }
})

export default router
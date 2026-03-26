/* Event Schema
title
description
location 
startDate
endDate
organizationId
createdBy (User ID)
tags (Tag IDs, think like sports or computer science)
isRSO (true = RSO event tab, false = student event tab)
flyer (I’d have to setup an S3 but should be ez with our current arch, optional)
status (upcoming / ongoing / cancelled / completed)
isPublic
rsvpEnabled (bool)
timestamps
*/

import  express from 'express'
import mongoose from 'mongoose'
import eventModel from '../models/Event.js'


const router = express.Router();


//Get Event
router.get('/', (req,res) => {
    res.status(200).json({message: 'Get Event'})
})

//Create Event
router.post('/', async (req, res) => {
    res.status(201).json({message: 'Create Event'})
})

//Update Event
router.put('/', async (req, res) => {
    res.status(200).json({message: 'Update Event'})
})

//Delete Event
router.delete('/:eventId', async (req, res) => {
    res.status(200).json({message: 'Delete Event'})
})

export default router
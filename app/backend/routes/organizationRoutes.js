/* Organization Schema
name -- required
description
verificationStatus
knightConnectUrl
contactEmail
logo
socialLinks
createdBy -- required
president
members
 */

import express from 'express'
import Organization from '../models/Organization.js'
import Event from '../models/Event.js'

const router = express.Router()

//Create Organization
router.post('/create', async(req, res) => {
    
    try {

        //Get organization information
        const { name, description, verificationStatus, knightConnectUrl, 
                category, contactEmail, logo, socialLinks, createdBy, president } = req.body
        
        if(!name || !createdBy) return res.status(400).json({message:"Required fields are missing"})
        
        //Check if organization already exists
        const organization = await Organization.findOne({name})
        if(organization) return res.status(400).json({message:"Organization already exits"})

        //Create new organization
        const newOrganization = await Organization.create({
            name, 
            description,
            verificationStatus,
            knightConnectUrl,
            category,
            contactEmail,
            logo, 
            socialLinks,
            createdBy,
            president
        })

        return res.status(201).json({Organization:newOrganization})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error during organization creation"})
    }
})

//Get All Organization (name, description, and category)
router.get('/', async (req, res) => {

    try {

        const organizations = await Organization.find().select('name description category')

        if(!organizations) return res.status(500).json({message:" Error Getting Organization"})

        return res.status(200).json({Organizations: organizations})

    } catch(error) {
        console.log(error)
        res.json({message:"Could not get organizations"})
    }
})

//Get specific Organization and their events
router.get('/:orgId', async (req, res) => {

    const organization = await Organization.findById(req.params.orgId)

    if(!organization) return res.status(500).json({messsage:"Could not find organization"})
    
    const organizationEvents = await Event.find({
        organizationId: req.params.orgId
    })

    return res.status(200).json({Organization:organization,Events:organizationEvents})
})

//Update Organization
router.put('/:orgId', async (req, res) => {

    //Find organization and update
    const updatedOrganization = await Organization.findByIdAndUpdate(
        {_id: req.params.orgId},
        req.body,
        {returnDocument: 'after'}
    )
    //Figure out how to update members
    
    if(!updatedOrganization) return res.status(500).json({message:"Could not update organization"})
    
    return res.status(200).json({Organization:updatedOrganization})
})

//Delete Organization
router.delete('/:orgId', async(req, res) =>{

    try {

        //Find organization and delete
        const organization = await Organization.findByIdAndDelete({_id:req.params.orgId})

        if(!organization) return res.status(500).json({message:"Could not delete organization"})
        
        return res.status(200).json({message:"Organization Deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Could Not Delete Organization"})
    }
})

export default router
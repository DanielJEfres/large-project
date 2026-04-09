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
import pagination from './helpers/pagination.js'

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

//Get all organizations OR partial search organizaitons (name, description, and category) with pagination
router.get('/', async (req, res) => {

    try {

        const { name } = req.query

        let page, organizations = null

        //Get Organizations by name
        if(name) {

            const regex = new RegExp(name, "i")

            //Pagination
            const filter = {name: {$regex:regex}}
            page = await pagination(req.query.page, req.query.limit, filter, Organization)

            organizations = await Organization.find({
                name: {$regex:regex}
            }).select('name description category').skip(page?.skip).limit(page?.limit)

        //Get All Organizations
        } else {

            //Pagination
            const filter = {}
            page = await pagination(req.query.page, req.query.limit, filter, Organization)

            organizations = await Organization.find().select('name description category').skip(page?.skip).limit(page?.limit)

            if(!organizations) return res.status(500).json({message:" Error Getting Organizations"})
        }

        return res.status(200).json({
                Organizations: organizations, 
                pageInfo:{
                    numberOfPages:page?.numPages, 
                    hasPrevPage:Boolean(page?.hasPrevPage), 
                    hasNextPage:Boolean(page?.hasNextPage)
        }})

    } catch(error) {
        console.log(error)
        res.json({message:"Could not get organizations"})
    }
})

//Get specific Organization and their events
router.get('/:orgId', async (req, res) => {

    try {

        const orgId = req.params.orgId

        const organization = await Organization.findById(orgId)

        if(!organization) return res.status(500).json({messsage:"Could Not Find Organization"})
        
        //Pagination
        const filter = {organizationId: orgId}
        const page = await pagination(req.query.page, req.query.limit, filter, Event)

        const organizationEvents = await Event.find({
            organizationId: orgId
        }).skip(page?.skip).limit(page?.limit)

        return res.status(200).json({
            Organization:organization,
            Events:organizationEvents, 
            pageInfo: {
                numberOfPages:page?.numPages, 
                hasPrevPage:Boolean(page?.hasPrevPage), 
                hasNextPage:Boolean(page?.hasNextPage)
        }})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error Getting Organizations"})
    }
})

//Update Organization
router.put('/:orgId', async (req, res) => {

    //Find organization and update
    const updatedOrganization = await Organization.findByIdAndUpdate(
        {_id: req.params.orgId},
        req.body,
        {returnDocument: 'after'}
    )
    
    if(!updatedOrganization) return res.status(500).json({message:"Could Not Update Organization"})
    
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
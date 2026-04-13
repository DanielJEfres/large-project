import express from 'express'
import User from '../models/User.js'
import Organization from '../models/Organization.js'
import authenticateToken from '../middleware/authenticateToken.js'
import { upload, uploadToS3 } from '../middleware/upload.js'

const router = express.Router()

// GET /api/users/me — fetch the logged-in user's profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.sub)
            .select('-passwordHash -verificationToken -resetPasswordToken -resetPasswordExpires')

        if (!user) return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.ucfEmail,
                bio: user.bio,
                profilePicture: user.profilePicture,
                organization: Object.fromEntries(user.organization || new Map()),
                interests: user.interests,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

// PATCH /api/users/me — update profile (firstName, lastName, bio, profilePicture)
router.patch('/me', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const { firstName, lastName, bio } = req.body
        const updates = {}

        if (firstName !== undefined) updates.firstName = firstName.trim()
        if (lastName !== undefined) updates.lastName = lastName.trim()
        if (bio !== undefined) updates.bio = bio.trim()

        if (req.file) {
            updates.profilePicture = await uploadToS3(req.file, 'profile-pictures')
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' })
        }

        const user = await User.findByIdAndUpdate(
            req.user.sub,
            updates,
            { new: true, runValidators: true }
        ).select('-passwordHash -verificationToken -resetPasswordToken -resetPasswordExpires')

        if (!user) return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.ucfEmail,
                bio: user.bio,
                profilePicture: user.profilePicture,
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

// GET /api/users/me/organizations — fetch organizations the user belongs to
router.get('/me/organizations', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.sub).select('organization')
        if (!user) return res.status(404).json({ message: 'User not found' })

        // user.organization is a Map<orgName, role>
        const orgNames = Array.from(user.organization.keys())

        if (orgNames.length === 0) {
            return res.status(200).json({ organizations: [] })
        }

        const organizations = await Organization.find({ name: { $in: orgNames } })
            .select('_id name description logo category')

        // Attach the user's role in each org
        const result = organizations.map(org => ({
            id: org._id,
            name: org.name,
            description: org.description,
            logo: org.logo,
            category: org.category,
            role: user.organization.get(org.name) ?? 'member',
        }))

        return res.status(200).json({ organizations: result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router

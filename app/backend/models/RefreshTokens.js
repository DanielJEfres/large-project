import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const refreshTokensSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    tokenHash: { 
    type: String, 
    required: true 
    },
    tokenId: { 
    type: String, 
    required: true 
    },
    expiresAt: { 
    type: Date,
    required: true,
    index: { expires: 0 }
    },
    revoked: { 
        type: Boolean, 
        default: false
    }
}, { timestamps: true })

refreshTokensSchema.pre("save", async function () {
  if (!this.isModified("tokenHash")) return;

  const salt = await bcrypt.genSalt(10);
  this.tokenHash = await bcrypt.hash(this.tokenHash, salt);
})

// Custom method for matching plaintext refreshToken to hashed DB refreshToken
refreshTokensSchema.methods.matchToken = async function (enteredToken) {
  return await bcrypt.compare(enteredToken, this.tokenHash);
};

export default mongoose.model('RefreshTokens', refreshTokensSchema)
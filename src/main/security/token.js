import jwt from 'jsonwebtoken'
import fs from 'fs'

function encode(token){
    const secret = fs.readFileSync('private.key')
    const payload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: token
    }

    return jwt.sign(payload, secret)
}

function decode(token){
    try {
        const secret = fs.readFileSync('private.key')
        return jwt.verify(token, secret)
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export default {
    encode,
    decode
}
import jwt from 'jsonwebtoken'
import fs from 'fs'
import utils from '../utils/utils'

function createkey(){
    if(!fs.existsSync('private.key')){
        fs.writeFile('private.key', utils.rdcode(32), (err) => {
            if(err){console.log(err.message)}
        })
    }
}

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
    createkey,
    encode,
    decode
}
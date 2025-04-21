const {jwtHandling} = require('./jwtHandling')
const {createJWT, isTokenValid, attachCookiesToResponse} = require('./jwt.js')
const {checkPermissions} = require('./checkpermissions.js')

module.exports = {
    jwtHandling,
    createJWT, 
    isTokenValid,
    attachCookiesToResponse,
    checkPermissions
}
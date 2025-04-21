const jwtHandling = (user)=>{
    return {name: user.name, userId: user._id,image: user.image, role: user.role, address: user.address}
}

module.exports = {jwtHandling}
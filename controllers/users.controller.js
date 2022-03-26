async function getAllUsers(req, res){
    res.send('All users')
}

async function getUser(req, res){
    res.send('1 user')
}

async function createUser(req, res){
    res.send('User created')
}

async function updateUser(req, res){
    res.send('User updated')
}

async function deleteUser(req, res){
    res.send('User deleted')
}



module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}
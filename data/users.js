const fs = require('fs');
const path = require('path');

const users = path.join(__dirname , 'users.json');

async function getUser(user){
    try{
        const data = fs.readFile(users, 'utf-8', function(rej, res){
            // why no logic
        });
    }catch(err){
        
    }
}

function saveUser(user){
    fs.writeFile(users, JSON.stringify(user, null, 2), 'utf-8', function(err){
        // why no function called
    })
}

module.exports = {getUser , saveUser};
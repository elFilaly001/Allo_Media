const Roles  = require("../../models/Roles.js")

// create a role 

async function createRole(roleName) {
    try {
        let role = await Roles.findOne({ name: roleName });

        if (!role) {
            const newRole = new Roles({ name: roleName });
            role = await newRole.save();
        }
        return role._id;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
}


module.exports = {
    createRole
}
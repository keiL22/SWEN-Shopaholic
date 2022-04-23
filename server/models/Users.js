//setup for Users table in database, will create one if it does not exist
module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Users
}
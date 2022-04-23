//setup for the Cart table, will create one if one doesnt exist
module.exports = (sequelize, DataTypes) => {

    const Orders = sequelize.define("Orders", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shippingInfo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cartInfo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cartTotal: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        orderStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });
    
    return Orders
}
//setup for the Cart table, will create one if one doesnt exist
module.exports = (sequelize, DataTypes) => {

    const Cart = sequelize.define("Cart", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    
    return Cart
}
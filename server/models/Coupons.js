//setup for the Cart table, will create one if one doesnt exist
module.exports = (sequelize, DataTypes) => {

    const Coupons = sequelize.define("Coupons", {
        couponName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        couponAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    
    return Coupons
}
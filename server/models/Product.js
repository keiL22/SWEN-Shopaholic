//setup for the Products table, will create one if one doesnt exist
module.exports = (sequelize, DataTypes) => {

    const Products = sequelize.define("Products", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productDesc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        productImg: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Products
}
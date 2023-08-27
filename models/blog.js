const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'Year must be an integer.',
            },
            min: {
                args: 1991,
                msg: 'Year must be at least 1991.',
            },
            max: {
                // current year
                args: new Date().getFullYear(),
                msg: 'Year cannot be greater than the current year.',
            },
        }
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
})

module.exports = Blog
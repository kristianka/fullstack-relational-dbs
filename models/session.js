const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../util/db');

class Session extends Model { }

Session.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'session',
    tableName: 'sessions',
});

module.exports = Session;

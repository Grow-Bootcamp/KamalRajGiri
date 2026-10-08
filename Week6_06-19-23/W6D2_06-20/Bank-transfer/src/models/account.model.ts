import {DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
class Account extends Model{
    declare id: number;
    declare account_name: string;
    declare email: string;
    declare balance: number;
}
Account.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    account_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Account",
    tableName: "accounts",
    timestamps: false
})

export default Account;
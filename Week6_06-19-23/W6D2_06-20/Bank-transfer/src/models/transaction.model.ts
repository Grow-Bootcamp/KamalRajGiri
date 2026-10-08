import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Transaction extends Model {
    declare id: number;
    declare from_account_id: number;
    declare to_account_id: number;
    declare amount: number;
    declare status: string;
    declare created_at: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        from_account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        to_account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        modelName: "Transaction",
        tableName: "transactions",
        timestamps: false
    }
);

export default Transaction;
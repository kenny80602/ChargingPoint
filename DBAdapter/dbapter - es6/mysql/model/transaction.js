import pkg from "sequelize";
const { Model, DataTypes } = pkg;
import { sequelize } from "../connection.js";
import { Pole } from "./pole.js";

export class Transaction extends Model {}
Transaction.init(
  {
    // Model attributes are defined here
    transactionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poleId: {
      field: "poleId",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    SoC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voltage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    energy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    power: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance   // 傳入Sequalize Instance，就是Connection建立連線後的Instance
    updatedAt: false,
    createdAt: false,
    modelName: "transaction", // We need to choose the model name // 定義ModelName
    tableName: "transaction",
  }
);

Transaction.belongsTo(Pole, { foreignKey: "poleId" });

// the defined model is the class itself
//console.log(user === sequelize.models.User); // true

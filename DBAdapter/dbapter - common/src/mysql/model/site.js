const pkg = require("sequelize");
const { Model, DataTypes } =pkg;
const  sequelize  = require("../connection.js");

class Site extends Model { }
module.exports =Site.init(
  {
    // Model attributes are defined here
    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("NOW()"),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance   // 傳入Sequalize Instance，就是Connection建立連線後的Instance
    modelName: "Site", // We need to choose the model name // 定義ModelName
    tableName: "Site",
  }
);

// the defined model is the class itself
//console.log(user === sequelize.models.User); // true

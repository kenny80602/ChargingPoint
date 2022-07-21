import  pkg   from 'sequelize'
const { Model, DataTypes } = pkg;
import {sequelize} from '../connection.js'


export class Pole extends Model{ }
Pole.init(
    {
        // Model attributes are defined here
        poleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
        },
        siteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        connectorNum:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        connectorId_1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        connectorStatus_1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        connectorId_2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        connectorStatus_2:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        // Other model options go here
        sequelize, // We need to pass the connection instance   // 傳入Sequalize Instance，就是Connection建立連線後的Instance
        updatedAt: false,
        createdAt: false,
        modelName: 'Pole', // We need to choose the model name // 定義ModelName
        tableName: "Pole"
    });



// the defined model is the class itself
//console.log(user === sequelize.models.User); // true

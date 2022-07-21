// const  pkg   = 'sequelize'
// const { Model, DataTypes } = pkg;
// const {sequelize} = '../connection.js'

// export class User extends Model{ }
// User.init(
//     {
//         // Model attributes are defined here
//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         vehiclePhoto: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         vehicleId:{
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         vehicleModel:{
//             type: DataTypes.STRING,
//             allowNull: false,
//         }
//     },{
//         // Other model options go here
//         sequelize, // We need to pass the connection instance   // 傳入Sequalize Instance，就是Connection建立連線後的Instance
//         modelName: 'user', // We need to choose the model name // 定義ModelName
//         tableName: "user"
//     });

// // the defined model is the class itself
// //console.log(user === sequelize.models.User); // true

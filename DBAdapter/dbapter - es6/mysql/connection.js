import Sequelize from 'sequelize'

//初始化MYSQL
export const sequelize = new Sequelize({
    database:'charging_test', 
    username:'root',
    password:'good5412', 
    dialect: 'mysql',
    host: 'localhost',
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    //logging: console.log,
    // ssl: true,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //     }
    // },
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (e) {
    console.log('Unable to connect to the database:', e)
}



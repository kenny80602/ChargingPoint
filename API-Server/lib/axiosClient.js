import axios from "axios"
import * as config from "../config/prod.js"

export const DBAdapter = axios.create({
    baseURL: config.DB_Adapter_URL
});



export const CentralSystem = axios.create({
    baseURL: config.Central_System_URL
});
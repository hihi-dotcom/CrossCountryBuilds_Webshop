import dotenv from "dotenv";
dotenv.config();

class DBConfig{
    constructor(){
        return{
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE
        }
    }
}

const config = {
    database: new DBConfig(),
    jwtSecret: process.env.JWT_SECRET!,
    maxSize: 200796767
};

export default config;
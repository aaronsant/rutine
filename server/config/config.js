import pg from 'pg';
import env from 'dotenv';

env.config({
    path:'../.env'
})

const Pool = ( process.env.NODE_ENV === "production" ? 
    new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:{
            rejectUnauthorized: false
        }
    })
    :
    new pg.Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    })
)

export default Pool;
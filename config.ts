import dotenv from 'dotenv'

// Load base .env file first (if it exists)
dotenv.config()

// Then load environment-specific file
const envFile = process.env.NODE_ENV || 'development'
dotenv.config({
  path: `.env.${envFile}`
})

interface Config {
  env: string
  backendUrl: string
  apiKey: string
  isProduction: boolean
  isDevelopment: boolean
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
  apiKey: process.env.API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}

export default config 
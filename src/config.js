/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'no-reply@rest-project.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    defaultAdminEmail: requireProcessEnv('DEF_ADMIN_EMAIL'),
    defaultAdminPassword: requireProcessEnv('DEF_ADMIN_PASSWORD'),
    defaultAdminPhone: requireProcessEnv('DEF_ADMIN_PHONE'),
    twilioAccountSid: requireProcessEnv('TWILIO_ACCOUNT_SID'),
    twilioAuthToken: requireProcessEnv('TWILIO_AUTH_TOKEN'),
    twilioVerifSid: requireProcessEnv('TWILIO_VERIF_SID'),
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    }
  },
  test: {},
  development: {
    mongo: {
      uri: 'mongodb://localhost/rest-project-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/rest-project'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports

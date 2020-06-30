import { success, notFound } from '../response'
import { User } from '../../api/user'
import schedule from 'node-schedule'

import {
  defaultAdminEmail,
  defaultAdminPassword,
  defaultAdminPhone
} from '../../config'

export function checkForOrCreateAdmin(res) {
  User.findOne({ role: 'admin' })
    .then((user) => {
      if (!user)
        User.create({
          name: 'HercAdmin',
          email: defaultAdminEmail,
          password: defaultAdminPassword,
          phone: defaultAdminPhone,
          role: 'admin'
        })
    })
    .then(success(res, 201))
    .catch((err) => new Error())
}

export const runSchedules = async (res) => {
  schedule.scheduleJob('11 12 * * 0-6', async () => {
    await User.deleteMany({ verified: 'false' })
      .then(notFound(res))
      .then(success(res, 204))
      .catch((err) => new Error())
  })
}

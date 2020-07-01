import { User } from '.'
import { Posts } from '../posts/index.js'
import { FriendRequest } from '../friendRequest/index.js'
import { twilioAccountSid, twilioAuthToken, twilioVerifSid } from '../../config'
const twilio = require('twilio')(twilioAccountSid, twilioAuthToken)
import { success, notFound } from '../../services/response/'

export const showUserFriends = ({ user }, res, next) => {
  User.find({ _id: { $all: user.friends } })
    .then(notFound(res))
    .then((friends) => friends.map((friend) => friend.view()))
    .then(success(res, 200))
    .catch(next)
}

export const sendFriendRequest = async ({ user, params }, res) => {
  try {
    const request = await FriendRequest.create({
      requester: user._id,
      recipient: params.addToFriendUserId
    })
    await User.updateMany(
      { _id: { $in: [user._id, params.addToFriendUserId] } },
      { $addToSet: { friendsRequests: request._id } },
      { new: true }
    )
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: `Sending request failure. Error: ${err}`
    })
  }
  return res.status(201).json({
    valid: true,
    message: 'Request successfully sended'
  })
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.countDocuments(query)
    .then((count) =>
      User.find(query, select, cursor).then((users) => ({
        rows: users.map((user) => user.view(true)),
        count
      }))
    )
    .then(success(res, 200))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.view() : null))
    .then(success(res, 200))
    .catch(next)

export const showMe = ({ user }, res) => res.json(user.view(true))

export const showUserPosts = ({ params }, res, next) =>
  Posts.find({ createdBy: params.id })
    .then(notFound(res))
    .then((posts) => posts.map((post) => post.view()))
    .then(success(res, 200))
    .catch(next)

export const showNearUsers = ({ querymen: { query } }, res, next) =>
  User.count(query)
    .then((count) =>
      User.find(query).then((users) => ({
        rows: users.map((user) => user.view(true)),
        count
      }))
    )
    .then(success(res, 200))
    .catch(next)

export const sendCode = async ({ user }, res) => {
  if (user.verified !== true) {
    try {
      await twilio.verify.services(twilioVerifSid).verifications.create({
        to: user.phone,
        channel: user.verificationMethod
      })
    } catch (err) {
      return res.status(400).json({
        valid: false,
        message: `Sending code failure. Error: ${err}`
      })
    }
    return res.status(200).json({
      valid: true,
      message: `Message send to ${user.phone}`
    })
  }
  return res.status(418).json({
    valid: false,
    message: `${user.name} you have been already verified`
  })
}

export const create = ({ bodymen: { body }, user }, res, next) => {
  const isCreateAdminUser = body.role === 'admin'
  if (!user._id && !isCreateAdminUser) {
    User.create(body)
      .then((user) => user.view(true))
      .then(success(res, 201))
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          res.status(409).json({
            valid: false,
            param: email,
            message: 'email already registered'
          })
        } else {
          next(err)
        }
      })
  } else if (user.role === 'admin') {
    User.create(body)
      .then((user) => user.view(true))
      .then(success(res, 201))
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          res.status(409).json({
            valid: false,
            param: 'email',
            message: 'email already registered'
          })
        } else {
          next(err)
        }
      })
  } else {
    res.status(401).json({
      valid: false,
      message: `You can't create ${body.role} role user`
    })
    return null
  }
}

export const verifyCode = async ({ bodymen: { body }, user }, res) => {
  let verificationResult
  try {
    verificationResult = await twilio.verify
      .services(twilioVerifSid)
      .verificationChecks.create({
        code: body.code,
        to: user.phone
      })
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: `Verification code check failure. Error: ${err}`
    })
  }

  if (verificationResult.status === 'approved') {
    user.verified = true
    await user.save()
    return res.status(200).json({
      valid: true,
      message: `${user.name}, you are verified`
    })
  }
  res.status(400).json({
    valid: false,
    message: `Unable to verify code. Status: ${verificationResult.status}`
  })
}

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data"
        })
        return null
      }
      return result
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res, 201))
    .catch(next)

export const updatePassword = (
  { bodymen: { body }, params, user },
  res,
  next
) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: "You can't change other user's password"
        })
        return null
      }
      return result
    })
    .then((user) =>
      user ? user.set({ password: body.password }).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res, 201))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next)

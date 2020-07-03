import { Friend } from '.'
// import { User } from '../user/index.js'

import { success, notFound } from '../../services/response'

export const showUserFriends = ({ user }, res, next) =>
  Friend.find({ $or: [{ friend1: user._id }, { friend2: user._id }] })
    .then(notFound(res))
    .then((friends) => friends.map((friend) => friend.view()))
    .then(success(res, 200))
    .catch(next)

export const deleteFriend = async ({ params, user }, res) => {
  try {
    await Friend.findOneAndDelete({
      $and: [
        { friend1: { $in: [user._id, params.id] } },
        { friend2: { $in: [user._id, params.id] } }
      ]
    })
    return res.status(200).json({
      valid: true,
      message: 'Deleted from friends'
    })
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: 'Deleting failure'
    })
  }
}

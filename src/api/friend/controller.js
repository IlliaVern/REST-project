import { Friend } from '.'
import { User } from '../user/index.js'

import { success, notFound } from '../../services/response'

export const createFriend = { user }

export const showUserFriends = ({ user }, res, next) =>
  User.find({ _id: { $all: user.friends } })
    //   Friend.find({ : { user._id } })
    .then(notFound(res))
    .then((friends) => friends.map((friend) => friend.view()))
    .then(success(res, 200))
    .catch(next)

export const deleteFriend = async ({ params, user }, res) => {
  try {
    let id1 = user._id.toString()
    let id2 = params.id.toString()
    if (id1 === id2) {
      return res.status(418).json({
        valid: false,
        message: 'Deleting failure'
      })
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { friends: id2 } },
        { new: true }
      )
      await User.findOneAndUpdate(
        { _id: params.id },
        { $pull: { friends: id1 } },
        { new: true }
      )
      return res.status(200).json({
        valid: true,
        message: 'Deleted from friends'
      })
    }
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: 'Something go wrong. Try again later'
    })
  }
}

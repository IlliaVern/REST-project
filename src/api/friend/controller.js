import { Friend } from '.'
import { success, notFound } from '../../services/response'

export const showUserFriends = ({ user }, res, next) =>
  Friend.find({ $or: [{ friend1: user._id }, { friend2: user._id }] })
    .then(notFound(res))
    .then((friends) =>
      friends.map((friend) =>
        friend.friend1.toString() === user._id.toString()
          ? friend.friend2
          : friend.friend1
      )
    )
    .then((friends) => friends.map((friend) => friend.view()))
    .then(success(res, 200))
    .catch(next)

export const deleteFriend = ({ params, user }, res, next) =>
  Friend.findOneAndDelete({
    $and: [
      { friend1: { $in: [user._id, params.id] } },
      { friend2: { $in: [user._id, params.id] } }
    ]
  })
    .then(notFound(res))
    .then(success(res, 204))
    .catch(next)

import { Friend } from '.'
import { success, notFound } from '../../services/response'

export const showUserFriends = (
  { querymen: { query, select, cursor } },
  res,
  next
) =>
  Friend.countDocuments(query)
    .then((count) =>
      Friend.find(query, select, cursor).then((friends) => ({
        rows: friends.map((friend) => friend.view()),
        count
      }))
    )
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

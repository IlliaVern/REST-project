import { FriendRequest } from '.'
import { User } from '../user/index'
import { success, notFound } from '../../services/response'

export const showFriendsRequests = ({ user }, res, next) => {
  FriendRequest.find({ recipient: user._id })
    .then(notFound(res))
    .then((requests) => requests.map((request) => request.view()))
    .then(success(res, 200))
    .catch(next)
}

export const considerFriendRequest = async ({ body, params, user }, res) => {
  try {
    let request = await FriendRequest.findOneAndDelete({
      _id: params.friendRequestId
    })
    if (body.status === 'accept') {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { friends: request.requester } },
        { new: true }
      )
      await User.findOneAndUpdate(
        { _id: request.requester },
        { $push: { friends: user._id } },
        { new: true }
      )
      return res.status(200).json({
        valid: true,
        message: 'Added to friends'
      })
    } else {
      // body.status === 'reject'
      await User.updateMany(
        { _id: { $in: [user._id, request.requester] } },
        { $pull: { friendsRequests: params.friendRequestId } },
        { new: true }
      )
      return res.status(200).json({
        valid: true,
        message: 'Request rejected'
      })
    }
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: 'Something go wrong. Try one more time'
    })
  }
}

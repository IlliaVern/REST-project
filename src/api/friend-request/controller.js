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

export const sendFriendRequest = async ({ user, params }, res) => {
  try {
    let existedRequest = await FriendRequest.findOne({
      $and: [{ requester: user._id }, { recipient: params.id }]
    })
    let isFriends = await User.findOne({
      friends: { $all: [params.id] }
    })
    if (existedRequest || isFriends || user._id == params.id) {
      return res.status(418).json({
        valid: false,
        message:
          'You have already sended request to that user or you are friends'
      })
    } else {
      await FriendRequest.create({
        requester: user._id,
        recipient: params.id
      })
      return res.status(201).json({
        valid: true,
        message: 'Request successfully sended'
      })
    }
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: `Sending request failure. Error: ${err}`
    })
  }
}

export const considerFriendRequest = async ({ body, params, user }, res) => {
  try {
    let request = await FriendRequest.findOneAndDelete({
      _id: params.id
    })
    let id1 = user._id.toString()
    let id2 = request.requester.toString()

    if (id1 !== id2 && body.status === 'accept') {
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
      // Reject friendship request
      return res.status(200).json({
        valid: true,
        message: 'Request rejected'
      })
    }
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: 'Something go wrong. Try again later'
    })
  }
}

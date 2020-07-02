import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import {
  showFriendsRequests,
  sendFriendRequest,
  considerFriendRequest
} from './controller'
import { schema } from './model'
export FriendRequest, { schema } from './model'

const router = new Router()
const { status } = schema.tree

// Show all friendship requests
router.get('/', token({ required: true }), showFriendsRequests)

// Send friendship request
router.post('/:id', token({ required: true }), sendFriendRequest)

//Delete friend request
router.delete(
  '/:id',
  token({ required: true }),
  body({ status }),
  considerFriendRequest
)

export default router

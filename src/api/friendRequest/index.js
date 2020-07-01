import { Router } from 'express'
// import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { showFriendsRequests, considerFriendRequest } from './controller'
import { schema } from './model'
export FriendRequest, { schema } from './model'

const router = new Router()
const { status } = schema.tree

router.get('/', token({ required: true }), showFriendsRequests)

router.delete(
  '/:friendRequestId',
  token({ required: true }),
  body({ status }),
  considerFriendRequest
)

export default router

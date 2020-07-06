import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { showUserFriends, deleteFriend } from './controller'
import { schema } from './model'
export Friend, { schema } from './model'

const router = new Router()

// Show User's friends
router.get(
  '/',
  token({ required: true }),
  query({
    my: { type: String, paths: ['friend1', 'friend2'], operator: '$eq' }
  }),
  showUserFriends
)

// Delete user from friends
router.delete('/:id', token({ required: true }), deleteFriend)

export default router

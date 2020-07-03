import { Router } from 'express'
// import { middleware as query } from 'querymen'
// import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { showUserFriends, deleteFriend } from './controller'
import { schema } from './model'
export Friend, { schema } from './model'

const router = new Router()

// Create friend
// router.post('/', token({ required: true }), createFriend)

// Show User's friends
router.get('/', token({ required: true }), showUserFriends)

// Delete user from friends
router.delete('/:id', token({ required: true }), deleteFriend)

export default router

import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Posts, { schema } from './model'

const router = new Router()
const { title } = schema.tree

/**
 * @api {post} /posts Create posts
 * @apiName CreatePosts
 * @apiGroup Posts
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Posts's title.
 * @apiSuccess {Object} posts Posts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Posts not found.
 * @apiError 401 user access only.
 */
router.post('/', token({ required: true }), body({ title }), create)

/**
 * @api {get} /posts Retrieve posts
 * @apiName RetrievePosts
 * @apiGroup Posts
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of posts.
 * @apiSuccess {Object[]} rows List of posts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', query(), index)

/**
 * @api {get} /posts/:id Retrieve posts
 * @apiName RetrievePosts
 * @apiGroup Posts
 * @apiSuccess {Object} posts Posts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Posts not found.
 */
router.get('/:id', show)

/**
 * @api {put} /posts/:id Update posts
 * @apiName UpdatePosts
 * @apiGroup Posts
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Posts's title.
 * @apiSuccess {Object} posts Posts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Posts not found.
 * @apiError 401 user access only.
 */
router.put('/:id', token({ required: true }), body({ title }), update)

/**
 * @api {delete} /posts/:id Delete posts
 * @apiName DeletePosts
 * @apiGroup Posts
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Posts not found.
 * @apiError 401 user access only.
 */
router.delete('/:id', token({ required: true }), destroy)

export default router

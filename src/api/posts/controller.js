import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Posts } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Posts.create({ ...body, createdBy: user })
    .then((posts) => posts.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Posts.countDocuments(query)
    .then((count) =>
      Posts.find(query, select, cursor)
        .populate('createdBy')
        .then((posts) => ({
          rows: posts.map((posts) => posts.view()),
          count
        }))
    )
    .then(success(res, 200))
    .catch(next)

export const show = ({ params }, res, next) =>
  Posts.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then((posts) => (posts ? posts.view() : null))
    .then(success(res, 200))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Posts.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'createdBy'))
    .then((posts) => (posts ? Object.assign(posts, body).save() : null))
    .then((posts) => (posts ? posts.view(true) : null))
    .then(success(res, 201))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Posts.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'createdBy'))
    .then((posts) => (posts ? posts.remove() : null))
    .then(success(res, 204))
    .catch(next)

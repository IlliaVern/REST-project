import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import {
  password as passwordAuth,
  master,
  masterOrToken,
  token,
} from "../../services/passport";
import {
  index,
  showMe,
  show,
  showUserPosts,
  showNearUsers,
  sendCodeToUserPhone,
  checkCodeFromUserPhone,
  create,
  update,
  updatePassword,
  destroy,
} from "./controller";
import { schema } from "./model";
export User, { schema } from "./model";

const router = new Router();
const { email, password, name, picture, role, phone, location } = schema.tree;

/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} users List of users.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get("/", token({ required: true, roles: ["admin"] }), query(), index);

/**
 * @api {get} /users/me Retrieve current user
 * @apiName RetrieveCurrentUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} user User's data.
 */
router.get("/me", token({ required: true }), showMe);

/**
 * @api {get} /users/:id Retrieve user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiPermission public
 * @apiSuccess {Object} user User's data.
 * @apiError 404 User not found.
 */
router.get("/:id", show);

/**
 * @api {get} /users/:id/posts Retrieve user's posts
 * @apiName RetrieveUserPosts
 * @apiGroup User
 * @apiPermission public
 * @apiSuccess {Object} user posts data.
 * @apiError 404 User's posts not found.
 */
router.get("/:id/posts", showUserPosts);

/**
 * @api {get} /users/:id/near Retrieve users near user's location
 * @apiName RetrieveUser'sNearUsers
 * @apiGroup User
 * @apiPermission user
 * @apiSuccess {Object} near user's user data.
 * @apiError 404 User's near users not found.
 */
router.get(
  "/:id/friends",
  token({ required: true }),
  query({ near: { paths: ["location.coordinates"] } }, { near: true }),
  showNearUsers
);

/**
 * @api {get} /users/verify Send verification code to user's phone
 * @apiName Send Verification Code
 * @apiGroup User
 * @apiPermission user
 * @apiSuccess {Object} data of sending verification code.
 * @apiError 404 User's phone verification code sending failure.
 */
router.get(
  "/verify",
  token({ required: true, roles: ["admin", "user"] }),
  sendCodeToUserPhone
);

/**
 * @api {post} /users Create user
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiParam {String} [location] User's location.
 * @apiParam {String=user,admin} [role=user] User's role.
 * @apiSuccess (Sucess 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post(
  "/",
  masterOrToken({ required: true }),
  body({ email, password, name, picture, role, phone, location }),
  create
);

router.post("/verify", token({ required: true }), checkCodeFromUserPhone);

/**
 * @api {put} /users/:id Update user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user or admin access only.
 * @apiError 404 User not found.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ name, picture, location }),
  update
);

/**
 * @api {put} /users/:id/password Update password
 * @apiName UpdatePassword
 * @apiGroup User
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String{6..}} password User's new password.
 * @apiSuccess (Success 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user access only.
 * @apiError 404 User not found.
 */
router.put("/:id/password", passwordAuth(), body({ password }), updatePassword);

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 User not found.
 */
router.delete("/:id", token({ required: true, roles: ["admin"] }), destroy);

export default router;

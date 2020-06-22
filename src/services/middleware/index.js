import { success } from "../response";
import { User } from "../../api/user";

import { defaultAdminEmail, defaultAdminPassword } from "../../config";

export default function isAdmin(res) {
  User.findOne({ role: "admin" })
    .then((user) => {
      if (!user)
        User.create({
          name: "HercAdmin",
          email: defaultAdminEmail,
          password: defaultAdminPassword,
          role: "admin",
        });
    })
    .then(success(res, 201))
    .catch((err) => new Error());
}

// export const needRole = (requiredRole) => {
//   return (req, res, next) => {
//     if (req.currentUser.role === requiredRole) {
//       return next()
//     } else {
//       return res.status(401).json({
//         message: 'Action not allowed'
//       })
//     }
//   }
// }

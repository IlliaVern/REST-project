import { success, notFound } from "../response";
import { User } from "../../api/user";

import { defaultAdminEmail, defaultAdminPassword } from "../../config";

export default function isAdmin(res) {
  User.findOne({ role: "admin" })
    .then((user) => {
      if (!user)
        User.create({
          name: "Herc Admin",
          email: defaultAdminEmail,
          password: defaultAdminPassword,
          role: "admin",
        });
    })
    .then(success(res, 201))
    .catch((err) => new Error());
}

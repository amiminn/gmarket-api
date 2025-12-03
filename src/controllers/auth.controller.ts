import { db } from "@/config/database";
import { hashcompare, hashpassword } from "@/config/string";
import { ROLE, STATUS } from "@/generated/prisma/enums";

export const AuthController = {
  login: async ({ body, jwt, set }: any) => {
    const { username, password } = body;

    const user = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      set.status = 401;
      return { message: "Invalid username or password" };
    }

    const isValid = await hashcompare(password, user.password);
    if (!isValid) {
      set.status = 401;
      return { message: "Invalid username or password" };
    }

    const token = await jwt.sign({
      id: user.id,
      username: user.username,
      role: user.role ?? "user",
    });

    set.headers = {
      Authorization: `Bearer ${token}`,
      "X-Auth-Token": token,
    };

    return { token };
  },

  register: async ({ body }: any) => {
    const { username, email, password } = body;
    try {
      const finduser = await db.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (finduser) {
        return { message: "User already exists" };
      }

      const passwordhash = await hashpassword(password);
      const data = {
        username: username,
        email: email,
        password: passwordhash,
        role: ROLE.USER,
        pwd: password,
        status: STATUS.ACTIVE,
      };

      const user = await db.user.create({
        data,
      });

      return { message: "Register user barhasil.", user };
    } catch (error) {
      return { message: "Oops sepertinya ada kesalahan sistem" };
    }
  },

  profile: async ({ user }: any) => {
    return { user };
  },
};

import { db } from "@/config/database";
import { hashpassword } from "@/config/string";
import { ROLE, STATUS } from "@/generated/prisma/enums";

async function createUser() {
  try {
    const password = "password";
    const passwordhash = await hashpassword(password);
    const data = {
      username: "amiminn",
      email: "tholabul.amin@gmail.com",
      password: passwordhash,
      role: ROLE.ADMIN,
      pwd: password,
      status: STATUS.ACTIVE,
    };
    const res = await db.user.create({
      data,
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function run() {}

console.log("run migration");
run();
console.log("done migration");

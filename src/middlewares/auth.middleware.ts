export const authMiddleware = async ({ jwt, headers, set, store }: any) => {
  const token = headers.authorization?.split(" ")[1];

  if (!token) {
    set.status = 401;
    return { message: "Unauthorized" };
  }

  const user = await jwt.verify(token);

  if (!user) {
    set.status = 401;
    return { message: "Invalid token" };
  }

  store.user = user;
};

const canUpdateUser = (user, updatedUser) => {
  return user.id === updatedUser.id || user.role === ROLES.ADMIN;
};

const canGetUser = (user, userId) => {
  return user.id === userId || user.role === ROLES.ADMIN;
};

const canDeleteUser = (user, userId) => {
  return user.id === userId;
};

export { canUpdateUser, canGetUser, canDeleteUser };

const cleanUser = (user) => {
    const { password, id, is_verified, role, is_deleted, last_login, createdAt, updatedAt, ...rest } = user.dataValues;
    return rest;
}

export default cleanUser;

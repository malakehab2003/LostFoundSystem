export const cleanUser = (user) => {
    const { password, id, is_verified, role, is_deleted, last_login, created_at, updated_at, ...rest } = user.dataValues;
    return rest;
}

export const cleanAddress = (address) => {
    const { user_id, id, created_at, updated_at, is_deleted, ...rest } = address.dataValues;
    return rest;
};


export const cleanAddresses = (addresses) => {
  return addresses.map(address => {
    const { user_id, id, created_at, updated_at, ...rest } = address.dataValues;
    return rest;
  });
};
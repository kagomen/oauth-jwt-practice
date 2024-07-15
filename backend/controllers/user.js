export const getUserProfile = async (c) => {
  const payload = c.get('jwtPayload')
  const requestedUsername = c.req.param('userName')
  const authenticatedUsername = payload.email

  if (authenticatedUsername !== requestedUsername) {
    return c.json({ message: 'アクセス権限がありません' }, 403)
  }

  return c.json({
    message: `${authenticatedUsername}のユーザーページです`,
    email: payload.email,
  })
}

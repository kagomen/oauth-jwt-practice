import { z } from 'zod'

const userSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: 'メールアドレスの形式で入力してください' })
    .max(254, { message: '最大254文字までです' })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください' })
    .max(254, { message: '最大254文字までです' }),
})

export default userSchema

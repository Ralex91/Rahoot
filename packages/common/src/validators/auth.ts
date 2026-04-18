import z from "zod"

export const usernameValidator = z
  .string()
  .min(4, "errors:auth.usernameTooShort")
  .max(20, "errors:auth.usernameTooLong")

export const inviteCodeValidator = z
  .string()
  .length(6, "errors:auth.invalidInviteCode")

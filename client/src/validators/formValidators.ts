import { z } from "zod";

const noLeadingTrailingSpaces = (value: string) =>
  !value.startsWith(" ") && !value.endsWith(" ");

const noConsecutiveSpaces = (value: string) => !/\s\s/.test(value);

const noSpaces = (value: string) => !/\s/.test(value);

export const userNameValidator = z
  .string()
  .min(1, {
    message: "Name should not be empty.",
  })
  .refine(noLeadingTrailingSpaces, {
    message: "Name should not have leading or trailing spaces.",
  })
  .refine(noConsecutiveSpaces, {
    message: "Name should not have consecutive spaces.",
  });

export const userHandleValidator = z
  .string()
  .min(1, {
    message: "Handle should not be empty.",
  })
  .refine(noSpaces, {
    message: "Handle should not contain any spaces.",
  });

export const userPasswordValidator = z.string().min(1, {
  message: "Password should not be empty.",
});

export const urlValidator = z.string().min(1, {
  message: "URL can not be empty.",
});

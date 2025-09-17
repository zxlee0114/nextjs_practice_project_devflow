import z from "zod";

export const SignInSchema = z.object({
  email: z.email("Please provide a valid email address."),

  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long." })
    .max(100, { error: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Password must contain at least one special character.",
    }),
});

export const SignUpSchema = SignInSchema.extend({
  username: z
    .string({ error: "Username is required." })
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(30, { error: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { error: "Name is required." })
    .max(50, { error: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      error: "Name can only contain letters and spaces.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required." })
    .max(100, { error: "Title cannot exceed 100 characters." }),
  content: z.string().min(1, { error: "Content is required." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { error: "Tag is required." })
        .max(30, { error: "Tag cannot exceed 30 characters." })
    )
    .min(1, { error: "At least one tag is required." })
    .max(5, { error: "Cannot add more than 5 tags." }),
});

export const UserSchema = SignUpSchema.omit({ password: true }).extend({
  bio: z.string().optional(),
  image: z.url({ error: "Please provide a valid url." }).optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  reputation: z.number().optional(),
});

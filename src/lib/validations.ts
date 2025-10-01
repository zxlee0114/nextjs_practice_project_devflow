import z from "zod";

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().min(1, "Page must be at least 1").default(1),
  pageSize: z.number().min(1, "Page size must be at least 1").default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

// * ===== user & auth ===== * //
export const SignInSchema = z.object({
  email: z.email("Please provide a valid email address"),

  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(100, { error: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export const SignUpSchema = SignInSchema.extend({
  username: z
    .string({ error: "Username is required" })
    .min(3, { error: "Username must be at least 3 characters long" })
    .max(30, { error: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers, and underscores",
    }),

  name: z
    .string()
    .min(1, { error: "Name is required" })
    .max(50, { error: "Name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      error: "Name can only contain letters and spaces",
    }),
});

export const UserSchema = SignUpSchema.pick({ email: true }).extend({
  name: z.string().min(1, { error: "Name is required" }),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  image: z.url({ error: "Invalid image URL" }).optional(),
  location: z.string().optional(),
  portfolio: z.url({ error: "Invalid portfolio URL" }).optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = UserSchema.pick({
  name: true,
  image: true,
}).extend({
  userId: z.string(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(100, { error: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Password must contain at least one special character",
    })
    .optional(),
  provider: z.string().min(1, { error: "Provider is required" }),
  providerAccountId: z
    .string()
    .min(1, { error: "Provider account ID is required" }),
});

export const SignInWithOAuthSchema = AccountSchema.pick({
  providerAccountId: true,
}).extend({
  provider: z.enum(["github", "google"]),
  user: UserSchema.pick({
    name: true,
    username: true,
    email: true,
    image: true,
  }),
});

export const GetUserByIdSchema = z.object({
  userId: z.string().min(1, { error: "User ID is required" }),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.pick({
  page: true,
  pageSize: true,
}).extend(GetUserByIdSchema.shape);

export const GetUserAnswersSchema = GetUserQuestionsSchema;

export const GetUserTopTagsSchema = GetUserByIdSchema;

// * ===== question ===== * //
export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { error: "Title must be at least 5 characters" })
    .max(100, { error: "Title cannot exceed 100 characters" }),
  content: z.string().min(100, {
    message: "Question description must have Minimum of 100 characters.",
  }),
  tags: z
    .array(
      z
        .string()
        .min(1, { error: "Tag is required" })
        .max(15, { error: "Tag cannot exceed 15 characters" })
    )
    .min(1, { error: "At least one tag is required" })
    .max(5, { error: "Cannot add more than 5 tags" }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { error: "Question ID is required" }),
});

export const GetQuestionSchema = EditQuestionSchema.pick({ questionId: true });

export const GetTagQuestionSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
}).extend({
  tagId: z.string().min(1, { error: "Tag ID is required" }),
});

export const IncreaseQuestionViewSchema = GetQuestionSchema;

// * ===== collection ===== * //

export const CollectionBaseSchema = GetQuestionSchema; // Question ID

// * ===== answer ===== * //

export const AnswerFormSchema = z.object({
  content: z
    .string()
    .min(100, { error: "Answer should not be less than 100 characters" }),
});

export const CreateAnswerSchema = GetQuestionSchema.extend(
  AnswerFormSchema.shape
);

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend(
  GetQuestionSchema.shape
);

export const AIAnswerSchema = AskQuestionSchema.omit({ tags: true }).extend({
  userAnswer: z.string().optional(),
});

// * ===== vote ===== * //

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["question", "answer"], {
    error: "Invalid target type. Must be 'question' or 'answer'",
  }),
  voteType: z.enum(["upvote", "downvote"], {
    error: "Invalid vote type. Must be 'upvote' or 'downvote'",
  }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.union([z.literal(-1), z.literal(1)], {
    error: "Change must be -1 (decrement) or 1 (increment)",
  }),
});

export const GetVoteStateSchema = CreateVoteSchema.omit({ voteType: true });

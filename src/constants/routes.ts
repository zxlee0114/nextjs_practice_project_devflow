const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign_in",
  SIGN_UP: "/sign_up",
  COMMUNITY: "/community",
  COLLECTION: "/collection",
  ASK_QUESTION: "/ask_question",
  TAGS: "/tags",
  JOBS: "/jobs",
  PROFILE: "/profile",
};

export default ROUTES;

export const DYNAMIC_ROUTES = {
  QUESTION_DETAIL: (id: string) => `/questions/${id}`,
  TAG_CONTENT: (id: string) => `/tags/${id}`,
  PROFILE_DETAIL: (id: string) => `/profile/${id}`,
};

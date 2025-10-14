import ROUTES from "./routes";

const { HOME, COMMUNITY, COLLECTION, TAGS, PROFILE, ASK_QUESTION } = ROUTES;

export const NAV_LIST = [
  {
    imgURL: "/icons/home.svg",
    route: HOME,
    label: "Home",
  },
  {
    imgURL: "/icons/users.svg",
    route: COMMUNITY,
    label: "Community",
  },
  {
    imgURL: "/icons/star.svg",
    route: COLLECTION,
    label: "Collections",
  },
  // {
  //   imgURL: "/icons/suitcase.svg",
  //   route: JOBS,
  //   label: "Find Jobs",
  // },
  {
    imgURL: "/icons/tag.svg",
    route: TAGS,
    label: "Tags",
  },
  {
    imgURL: "/icons/user.svg",
    route: PROFILE,
    label: "Profile",
  },
  {
    imgURL: "/icons/question.svg",
    route: ASK_QUESTION,
    label: "Ask a Question",
  },
];

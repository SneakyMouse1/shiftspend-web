import { createContext } from "react";

export const PrivacyContext = createContext({
  isPrivate: false,
  togglePrivacy: () => {},
});

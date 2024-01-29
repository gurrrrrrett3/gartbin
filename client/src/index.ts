import "./editor/editor";
import "./editor/commands";
import "./editor/languageLoader";
import "./ui/header";
import "./ui/toolbar";
import "./ui/components/dropup"

import Profile from "./profile/profile";

export const profile = Profile.checkLogin()
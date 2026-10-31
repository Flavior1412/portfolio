import type { ProfileContent } from "./profile";

export interface ProfileRepository {
  read(): ProfileContent;
}

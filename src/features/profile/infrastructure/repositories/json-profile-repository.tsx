import type { ProfileRepository } from "../../domain/profile-repository";
import content from "../data/profile.json";

export const jsonProfileRepository: ProfileRepository = {
  read: () => content,
};

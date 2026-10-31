import type { ProfileContent } from "../domain/profile";
import type { ProfileRepository } from "../domain/profile-repository";

export function getProfile(repository: ProfileRepository): ProfileContent {
  return repository.read();
}

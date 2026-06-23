export interface ProfileGithubAccount {
  username: string;
  githubId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  mobile: string | null | "",
  githubAccount: ProfileGithubAccount | null;
}
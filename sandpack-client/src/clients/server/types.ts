export interface BranchInfoDTO {
  branch: {
    authorization: string;
    branch: string;
    email: string;
    id: string;
    name: string;
    repo: string;
    username: string;
  };
  pitcherManagerVersion: string;
  pitcherToken: string;
  pitcherURL: string;
  pitcherVersion: string;
  previewURL: string;
  sshPort: number;
  sshHost: string;
  username: string;
  vscodeURL: string;
  workspacePath: string;
  privateKey: string;
}

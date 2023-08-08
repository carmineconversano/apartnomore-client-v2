export enum ERole {
  ROLE_USER,
  ROLE_MODERATOR,
  ROLE_ADMIN,
}

export interface Role {
  name: ERole,
  id: number
}

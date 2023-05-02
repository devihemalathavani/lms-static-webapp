declare global {
  declare namespace Express {
    export interface User {
      iss: string;
      sub: string;
      aud: string[];
      iat: number;
      exp: number;
      azp: string;
      scope: string;
      permissions: string[];
    }

    export interface Request {
      user: User;
    }
  }
}

export interface AuthZPermission {
  // value of the permission
  value: string;
  // short description of the permission
  description: string;
}

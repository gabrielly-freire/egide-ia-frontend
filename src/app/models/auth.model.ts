export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthenticatedUserDTO {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
}

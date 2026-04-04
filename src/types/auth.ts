export type RegisterRequest = {
  email: string;
  phone: string;
  sex: string;
  religion: string;
  password: string;
  full_name: string;
  address: string;
};

export type CustomJwtPayload = {
  userId: string;
  purpose: "email_verification" | "reset_password";
};

export type LoginRequest = {
  email: string;
  password: string;
}
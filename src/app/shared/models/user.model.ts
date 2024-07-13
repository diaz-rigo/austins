// user.model.ts

export interface User {
  _id: string;
  email: string;
  password: string;
  rol: string;
  name: string;
  maternalLastname?: string;
  paternalLastname?: string;
  phone?: string;
  status: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  loginAttempts?: number;
  lockoutUntil?: Date;
  profilePhoto?: string;
}

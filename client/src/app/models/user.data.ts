import { IGroupRef } from './group.data';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  iconRef: string;
  email: string;
  phone: string;
  password: string;
  groupId: string;
  groupRef: IGroupRef;
  accountType?: AccountType;
  confirmationStatus: ConfirmationStatus;
  lastActiveDate: string;
}

export declare type UserShortData = Pick<
  IUser,
  'id' | 'firstName' | 'lastName' | 'groupId' | 'confirmationStatus' | 'lastActiveDate'
>;

export declare type UpdateUserByAdminData = Pick<IUser, 'id' | 'groupId'>;

export declare type AccountType = 'USER' | 'ADMIN';

export declare type ConfirmationStatus = 'REGISTERED' | 'CONFIRMED';

export declare type IUserSignUp = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>;

export declare type UserUpdateSelf = Pick<IUser, 'firstName' | 'lastName' | 'email'> & {
  oldPassword: string;
  newPassword: string;
};

export declare type UserResetPassword = Pick<IUser, 'password'> & { token: string };

export declare type IUserSignIn = Pick<IUser, 'email' | 'password'>;

export declare type IUserData = Pick<
  IUser,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'accountType'
  | 'email'
  | 'confirmationStatus'
  | 'groupRef'
  | 'lastActiveDate'
>;

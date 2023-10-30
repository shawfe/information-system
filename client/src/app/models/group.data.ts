import { UserShortData } from './user.data';

export interface IGroupRef {
  id: string;
  name: string;
}

export interface IGroupWithUsers extends IGroupRef {
  users: UserShortData[];
}

export interface IUpdateGroup extends IGroupRef {}

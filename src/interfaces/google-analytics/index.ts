import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface GoogleAnalyticsInterface {
  id?: string;
  access_token: string;
  refresh_token: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface GoogleAnalyticsGetQueryInterface extends GetQueryInterface {
  id?: string;
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
}

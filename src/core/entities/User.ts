import type { Subscription } from './subscription';

export interface User {
  id?: number;
  name: string;
  email: string;
  subscriptions: Subscription[];
}

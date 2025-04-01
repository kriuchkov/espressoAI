export interface Subscription {
  id: string;
  userId: number;
  url: string;
  interval: number; // в минутах
  lastChecked: Date;
}

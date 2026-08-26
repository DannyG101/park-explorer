import { parks } from '@park-explorer/db';

export type ParkResultDto = typeof parks.$inferSelect & {
  city: {
    id: number;
    name: string;
  };

  region: {
    id: number;
    name: string;
  };
};

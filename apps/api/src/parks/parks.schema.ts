import { z } from 'zod';

export const createParkInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  openingDate: z.string().nullable().optional(),
  cityId: z.number().int().positive(),
  latitude: z.number(),
  longitude: z.number(),
  polygon: z.unknown().optional(),
});

export const byIdInput = z.object({
  id: z.number().int().positive(),
});

export const updateParkData = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  openingDate: z.string().nullable().optional(),
  cityId: z.number().int().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  polygon: z.unknown().optional(),
});

export const updateParkInput = updateParkData.extend({
  id: z.number().int().positive(),
});

export const listParksInput = z.object({
  regionId: z.number(),
  cityId: z.number().optional(),
});

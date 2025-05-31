import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title cannot be empty"),
  artist: z.string().min(1, "Artist cannot be empty"),
  album: z.string().optional(),
  genres: z.array(z.string().min(1)).min(1, "At least one genre is required"),
  slug: z.string(),
  coverImage: z.string().optional(),
  audioFile: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TrackFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  genres: z.array(z.string().min(1)).min(1, "At least one genre is required"),
});

export const PaginatedTrackResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export const ResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string()),
});

export type Track = z.infer<typeof TrackSchema>;
export type TrackFormData = z.infer<typeof TrackFormSchema>;
export type PaginatedTrackResponse = z.infer<
  typeof PaginatedTrackResponseSchema
>;
export type ApiResponse = z.infer<typeof ResponseSchema>;

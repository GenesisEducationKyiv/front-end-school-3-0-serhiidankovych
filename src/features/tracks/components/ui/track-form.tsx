import { AlertCircle, CheckCircle, FileImage, Loader2, X } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTrackForm } from "@/features/tracks/hooks/use-track-form";
import { TrackFormData } from "@/features/tracks/schemas/schemas";

interface TrackFormProps {
  initialData?: Partial<TrackFormData>;
  onSubmit: (data: TrackFormData) => void;
  isSubmitting?: boolean;
  id?: string;
}

export function TrackForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  id,
}: TrackFormProps) {
  const {
    form,
    selectedGenres,
    imageStatus,
    showPreview,
    coverImageUrl,
    isLoadingGenres,
    isErrorGenres,
    genresError,
    filteredGenres,
    handleVerifyImage,
    handleClearImage,
    toggleGenre,
    handleRemoveGenre,
    handleFormSubmit,
    refetchGenres,
  } = useTrackForm({ initialData, onSubmit, isSubmitting });

  return (
    <Form {...form}>
      <form
        id={id}
        data-testid="track-form"
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Track Title<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter track title"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage data-testid="error-title" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Artist<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter artist name"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="input-artist"
                    />
                  </FormControl>
                  <FormMessage data-testid="error-artist" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="album"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter album name (optional)"
                      {...field}
                      disabled={isSubmitting}
                      data-testid="input-album"
                    />
                  </FormControl>
                  <FormMessage data-testid="error-album" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <div className="flex items-start gap-2">
                    <FormControl className="flex-grow">
                      <Input
                        placeholder="Enter image URL (optional)"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isSubmitting || imageStatus === "verifying"}
                        type="url"
                        data-testid="input-cover-image"
                        onChange={(e) => {
                          field.onChange(e);
                          // Note: Image status reset logic is handled in the hook
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleVerifyImage}
                      disabled={
                        !field.value ||
                        isSubmitting ||
                        imageStatus === "verifying"
                      }
                      aria-label="Verify Image URL"
                      data-testid="verify-url-button"
                      className={
                        imageStatus === "verified" ? "border-green-500" : ""
                      }
                    >
                      {imageStatus === "verifying" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : imageStatus === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="h-5 mt-1">
                    {imageStatus === "verifying" && (
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Verifying image URL...
                      </p>
                    )}
                    {imageStatus === "verified" && (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Image URL verified successfully
                      </p>
                    )}
                    {imageStatus === "error" && (
                      <p className="text-xs text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {form.formState.errors.coverImage?.message ||
                          "Could not load image."}
                      </p>
                    )}
                  </div>
                  <FormDescription className="text-xs pt-1">
                    Enter a valid image URL (JPG, PNG, GIF, etc.) and click to
                    verify
                  </FormDescription>
                  {imageStatus !== "error" && (
                    <FormMessage data-testid="error-cover-image" />
                  )}
                  <div className="mt-3 flex items-center justify-center bg-accent p-4 min-h-[120px] border-dashed border-2 border-border rounded-md">
                    {showPreview && imageStatus === "verified" ? (
                      <div className="relative group">
                        <div className="rounded border border-muted shadow-sm overflow-hidden">
                          <Image
                            src={coverImageUrl!}
                            alt="Cover preview"
                            width={100}
                            height={100}
                            loading="lazy"
                            className="object-cover transition-all"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={handleClearImage}
                            aria-label="Clear image URL"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-md flex flex-col items-center justify-center text-muted-foreground text-center">
                        <FileImage className="h-10 w-10 mb-1" />
                        <span className="text-xs leading-tight">
                          {imageStatus === "error"
                            ? "Invalid image URL"
                            : imageStatus === "verifying"
                              ? "Verifying..."
                              : imageStatus === "idle" && coverImageUrl
                                ? "Verification needed"
                                : "No image preview"}
                        </span>
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="genres"
          render={() => (
            <FormItem>
              <FormLabel>
                Genres<span className="text-destructive">*</span>
              </FormLabel>
              {selectedGenres.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Selected Genres:
                  </p>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {selectedGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="px-3 py-1 text-sm flex items-center gap-1.5 rounded-full"
                      >
                        {genre}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full hover:bg-background"
                          onClick={() => handleRemoveGenre(genre)}
                          aria-label={`Remove ${genre} genre`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Genres:
                  </p>
                  {isErrorGenres && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => refetchGenres()}
                      className="text-xs"
                    >
                      Retry
                    </Button>
                  )}
                </div>
                {isLoadingGenres && (
                  <div className="flex items-center text-sm text-muted-foreground py-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading genres...
                  </div>
                )}
                {isErrorGenres && (
                  <div className="text-sm text-destructive py-2 px-1 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Failed to load genres: {genresError?.message}
                  </div>
                )}
                {!isLoadingGenres &&
                  !isErrorGenres &&
                  (filteredGenres.length > 0 ? (
                    <ScrollArea className="h-24 w-full rounded-md border">
                      <div className="flex flex-wrap gap-1.5 p-3">
                        {filteredGenres.map((genre) => (
                          <Badge
                            key={genre}
                            variant="outline"
                            className="px-2.5 py-0.5 text-xs cursor-pointer hover:bg-accent transition-colors rounded-full"
                            onClick={() => toggleGenre(genre)}
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2 px-1">
                      {selectedGenres.length > 0
                        ? "All available genres have been selected"
                        : "No genres available"}
                    </p>
                  ))}
              </div>
              <FormDescription>
                Select at least one genre for your track
              </FormDescription>
              <FormMessage data-testid="error-genres" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

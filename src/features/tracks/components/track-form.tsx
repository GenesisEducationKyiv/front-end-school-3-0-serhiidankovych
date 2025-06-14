import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, FileImage, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { R } from "@mobily/ts-belt";
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
import { api, ApiError } from "../api/api";
import { TrackFormData, TrackFormSchema } from "../schemas/schemas";

type GenresState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: ApiError };

interface TrackFormProps {
  initialData?: Partial<TrackFormData>;
  onSubmit: (data: TrackFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  id?: string;
}

export function TrackForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  id,
}: TrackFormProps) {
  const form = useForm<TrackFormData>({
    resolver: zodResolver(TrackFormSchema),
    defaultValues: {
      title: initialData.title || "",
      artist: initialData.artist || "",
      album: initialData.album || "",
      genres: initialData.genres || [],
      coverImage: initialData.coverImage || "",
    },
    mode: "onChange",
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialData.genres || []
  );

  const [genresState, setGenresState] = useState<GenresState>({
    status: "idle",
  });

  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isVerifyingImage, setIsVerifyingImage] = useState(false);
  const [isImageVerified, setIsImageVerified] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const coverImageUrl = form.watch("coverImage");

  const fetchGenres = useCallback(async () => {
    setGenresState({ status: "loading" });
    const result = await api.getGenres();

    R.match(
      result,
      (data) => setGenresState({ status: "success", data }),
      (error) => setGenresState({ status: "error", error })
    );
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    const hasInitialImage =
      !!initialData?.coverImage && initialData.coverImage === coverImageUrl;
    if (hasInitialImage) {
      setShowPreview(true);
      setIsImageVerified(true);
    } else if (!coverImageUrl) {
      setShowPreview(false);
      setIsImageVerified(false);
      setImagePreviewError(false);
    } else {
      setShowPreview(isImageVerified && !imagePreviewError);
    }
  }, [
    coverImageUrl,
    initialData?.coverImage,
    isImageVerified,
    imagePreviewError,
  ]);

  const verifyImageUrl = useCallback(async (url: string): Promise<boolean> => {
    if (!url) return false;
    return new Promise((resolve) => {
      const img = new window.Image();
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
        resolve(false);
      }, 5000);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(false);
      };

      img.src = url.includes("?")
        ? `${url}&_cb=${Date.now()}`
        : `${url}?cb=${Date.now()}`;
    });
  }, []);

  const handleVerifyImage = useCallback(async () => {
    const url = form.getValues("coverImage");
    if (!url || isVerifyingImage) return;

    setIsVerifyingImage(true);
    setIsImageVerified(false);
    setImagePreviewError(false);

    const isValid = await verifyImageUrl(url);

    if (isValid) {
      setIsImageVerified(true);
      setShowPreview(true);
      form.clearErrors("coverImage");
    } else {
      setImagePreviewError(true);
      setShowPreview(false);
      form.setError("coverImage", {
        type: "manual",
        message: "Unable to load image from this URL.",
      });
    }

    setIsVerifyingImage(false);
  }, [form, verifyImageUrl]);

  useEffect(() => {
    if (
      !coverImageUrl ||
      isVerifyingImage ||
      isImageVerified ||
      imagePreviewError
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const imageUrlPattern = /\.(jpeg|jpg|gif|png|webp|svg|avif)(\?.*)?$/i;
      if (imageUrlPattern.test(coverImageUrl)) {
        handleVerifyImage();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    coverImageUrl,
    handleVerifyImage,
    isVerifyingImage,
    isImageVerified,
    imagePreviewError,
  ]);

  const handleClearImage = () => {
    form.setValue("coverImage", "", { shouldValidate: true });
    setShowPreview(false);
    setIsImageVerified(false);
    setImagePreviewError(false);
    form.clearErrors("coverImage");
  };

  const availableGenres =
    genresState.status === "success" ? genresState.data : [];

  const filteredGenres = availableGenres.filter(
    (genre) => !selectedGenres.includes(genre)
  );

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    form.setValue("genres", newGenres, { shouldValidate: true });
  };

  const handleRemoveGenre = (genre: string) => {
    const newGenres = selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(newGenres);
    form.setValue("genres", newGenres, { shouldValidate: true });
  };

  const handleSubmit = (data: TrackFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        id={id}
        data-testid="track-form"
        onSubmit={form.handleSubmit(handleSubmit)}
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
                        disabled={isSubmitting || isVerifyingImage}
                        type="url"
                        data-testid="input-cover-image"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsImageVerified(false);
                          setImagePreviewError(false);
                          setShowPreview(false);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleVerifyImage}
                      disabled={
                        !field.value || isSubmitting || isVerifyingImage
                      }
                      aria-label="Verify Image URL"
                      data-testid="verify-url-button"
                      className={isImageVerified ? "border-green-500" : ""}
                    >
                      {isVerifyingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isImageVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  <div className="h-5 mt-1">
                    {isVerifyingImage && (
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Verifying image URL...
                      </p>
                    )}
                    {!isVerifyingImage &&
                      isImageVerified &&
                      !imagePreviewError && (
                        <p className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Image URL verified successfully
                        </p>
                      )}
                    {!isVerifyingImage && imagePreviewError && (
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

                  {!isVerifyingImage && !imagePreviewError && (
                    <FormMessage data-testid="error-cover-image" />
                  )}

                  <div className="mt-3 flex items-center justify-center bg-accent p-4 min-h-[120px] border-dashed border-2 border-border rounded-md">
                    {showPreview &&
                    coverImageUrl &&
                    isImageVerified &&
                    !imagePreviewError ? (
                      <div className="relative group">
                        <div className="rounded border border-muted shadow-sm overflow-hidden">
                          <Image
                            src={coverImageUrl}
                            alt="Cover preview"
                            width={100}
                            height={100}
                            className="object-cover transition-all"
                            onError={() => {
                              setImagePreviewError(true);
                              setIsImageVerified(false);
                              setShowPreview(false);
                              form.setError("coverImage", {
                                type: "manual",
                                message: "Failed to load image preview.",
                              });
                            }}
                            unoptimized
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
                          {coverImageUrl && imagePreviewError
                            ? "Invalid image URL"
                            : coverImageUrl &&
                              !isImageVerified &&
                              !isVerifyingImage
                            ? "Verification needed"
                            : coverImageUrl && isVerifyingImage
                            ? "Verifying..."
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
                  {genresState.status === "error" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={fetchGenres}
                      className="text-xs"
                    >
                      Retry
                    </Button>
                  )}
                </div>

                {genresState.status === "loading" && (
                  <div className="flex items-center text-sm text-muted-foreground py-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading genres...
                  </div>
                )}

                {genresState.status === "error" && (
                  <div className="text-sm text-destructive py-2 px-1 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Failed to load genres: {genresState.error.message}
                  </div>
                )}

                {genresState.status === "success" &&
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

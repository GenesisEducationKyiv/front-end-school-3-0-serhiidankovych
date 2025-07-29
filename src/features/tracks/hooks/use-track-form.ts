import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useGenresQuery } from "@/features/tracks/hooks/use-genres";
import {
  TrackFormData,
  TrackFormSchema,
} from "@/features/tracks/schemas/schemas";

interface UseTrackFormProps {
  initialData?: Partial<TrackFormData>;
  onSubmit: (data: TrackFormData) => void;
  isSubmitting?: boolean;
}

export function useTrackForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}: UseTrackFormProps) {
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
  const [imageStatus, setImageStatus] = useState<
    "idle" | "verifying" | "verified" | "error"
  >("idle");
  const [showPreview, setShowPreview] = useState(false);

  const {
    data: availableGenres = [],
    isLoading: isLoadingGenres,
    isError: isErrorGenres,
    error: genresError,
    refetch: refetchGenres,
  } = useGenresQuery();

  const coverImageUrl = form.watch("coverImage");

  useEffect(() => {
    const hasInitialImage =
      !!initialData?.coverImage && initialData.coverImage === coverImageUrl;
    if (hasInitialImage) {
      setImageStatus("verified");
      setShowPreview(true);
    }
  }, [initialData?.coverImage, coverImageUrl]);

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
    if (!url || imageStatus === "verifying") return;
    setImageStatus("verifying");
    setShowPreview(false);
    const isValid = await verifyImageUrl(url);
    if (isValid) {
      setImageStatus("verified");
      setShowPreview(true);
      form.clearErrors("coverImage");
    } else {
      setImageStatus("error");
      setShowPreview(false);
      form.setError("coverImage", {
        type: "manual",
        message: "Unable to load image from this URL.",
      });
    }
  }, [form, verifyImageUrl, imageStatus]);

  useEffect(() => {
    if (!coverImageUrl || imageStatus !== "idle") return;
    const timer = setTimeout(() => {
      const imageUrlPattern = /\.(jpeg|jpg|gif|png|webp|svg|avif)(\?.*)?$/i;
      if (imageUrlPattern.test(coverImageUrl)) {
        handleVerifyImage();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [coverImageUrl, handleVerifyImage, imageStatus]);

  const handleClearImage = useCallback(() => {
    form.setValue("coverImage", "", { shouldValidate: true });
    setShowPreview(false);
    setImageStatus("idle");
    form.clearErrors("coverImage");
  }, [form]);

  const filteredGenres = availableGenres.filter(
    (g) => !selectedGenres.includes(g)
  );

  const toggleGenre = useCallback(
    (genre: string) => {
      const newGenres = selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre];
      setSelectedGenres(newGenres);
      form.setValue("genres", newGenres, { shouldValidate: true });
    },
    [selectedGenres, form]
  );

  const handleRemoveGenre = useCallback(
    (genre: string) => {
      const newGenres = selectedGenres.filter((g) => g !== genre);
      setSelectedGenres(newGenres);
      form.setValue("genres", newGenres, { shouldValidate: true });
    },
    [selectedGenres, form]
  );

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    selectedGenres,
    imageStatus,
    showPreview,
    coverImageUrl,
    availableGenres,
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
    isSubmitting,
  };
}

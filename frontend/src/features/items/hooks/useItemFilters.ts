import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import z, { date } from "zod";

const ItemFilterSchema = z.object({
  title: z.string().optional().default(""),
  place: z.string().optional().default(""),
  category_id: z.coerce.number().optional(),
  government_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  type: z.enum(["lost", "found"]),
  date: z.date().optional(),
});

type ItemFilterFormSchema = z.infer<typeof ItemFilterSchema>;

const EMPTY_VALUES: ItemFilterFormSchema = {
  title: "",
  place: "",
  type: "lost",
  category_id: undefined,
  government_id: undefined,
  city_id: undefined,
  date: undefined,
};

export function useItemFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { governments } = useGovernments();
  const { cities } = useCities();

  // ✅ Parse URL → form values
  const parseSearchParams = (): ItemFilterFormSchema => ({
    ...EMPTY_VALUES,
    title: searchParams.get("title") || "",
    place: searchParams.get("place") || "",
    type: (searchParams.get("type") as "lost" | "found") || "lost",
    category_id: searchParams.get("category_id")
      ? Number(searchParams.get("category_id"))
      : undefined,
    government_id: searchParams.get("government_id")
      ? Number(searchParams.get("government_id"))
      : undefined,
    city_id: searchParams.get("city_id")
      ? Number(searchParams.get("city_id"))
      : undefined,
    date: searchParams.get("date")
      ? new Date(searchParams.get("date")!)
      : undefined,
  });

  const form = useForm<ItemFilterFormSchema>({
    resolver: zodResolver(ItemFilterSchema),
    defaultValues: parseSearchParams(),
  });

  // ✅ Watch form values safely
  const watchedValues = useWatch({
    control: form.control,
  });

  // ✅ Filter cities based on selected government
  const filteredCities = useMemo(() => {
    if (!watchedValues.government_id) return cities;
    return cities?.filter(
      (c) => c.government_id === watchedValues.government_id,
    );
  }, [cities, watchedValues.government_id]);

  // ✅ Build API filters (derived state)
  const appliedFilters = useMemo(() => {
    const govt = governments?.find((g) => g.id === watchedValues.government_id);
    const city = filteredCities?.find((c) => c.id === watchedValues.city_id);

    return {
      title: watchedValues.title || undefined,
      place: watchedValues.place || undefined,
      government: govt?.name || undefined,
      city: city?.name || undefined,
      category_id: watchedValues.category_id || undefined,
      type: watchedValues.type || "lost",
      date: watchedValues.date ? watchedValues.date.toISOString() : undefined,
      page: currentPage,
      limit: 10,
    };
  }, [watchedValues, governments, filteredCities, currentPage]);

  // Sync URL → form (only when params exist)
  useEffect(() => {
    const hasParams = Array.from(searchParams.keys()).length > 0;

    if (hasParams) {
      form.reset(parseSearchParams());
    }
  }, [searchParams]);

  // Submit → update URL
  const onSubmit = (data: ItemFilterFormSchema) => {
    const params: Record<string, string> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    });

    setCurrentPage(1); // Reset to page 1 when applying filters
    setSearchParams(params);
  };

  // FIXED RESET (main bug solved here)
  const resetFilters = () => {
    setCurrentPage(1); // Reset pagination
    setSearchParams({});
    form.reset(EMPTY_VALUES);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(Math.max(1, currentPage - 1));
  };

  return {
    form,
    onSubmit,
    resetFilters,
    appliedFilters,
    filteredCities,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
  };
}

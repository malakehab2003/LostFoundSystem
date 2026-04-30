import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import z from "zod";

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

export function useItemFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { governments } = useGovernments();
  const { cities } = useCities();

  const form = useForm<ItemFilterFormSchema>({
    resolver: zodResolver(ItemFilterSchema),
    defaultValues: {
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
    },
  });

  const selectedGovernment = form.watch("government_id");

  const filteredCities = useMemo(() => {
    return cities?.filter((c) => c.government_id === selectedGovernment);
  }, [cities, selectedGovernment]);

  const buildFilters = (data: ItemFilterFormSchema) => {
    const govt = governments?.find((g) => g.id === data.government_id);
    const city = filteredCities?.find((c) => c.id === data.city_id);

    return {
      title: data.title || undefined,
      place: data.place || undefined,
      government: govt?.name || undefined,
      city: city?.name || undefined,
      category_id: data.category_id,
      type: data.type,
      page: 1,
      limit: 50,
    };
  };

  const [appliedFilters, setAppliedFilters] = useState(
    buildFilters(form.getValues()),
  );

  // ✅ sync URL → filters whenever search params or data changes
  useEffect(() => {
    const values = form.getValues();
    const filters = buildFilters(values);
    setAppliedFilters(filters);
  }, [searchParams, governments, filteredCities]);

  // ✅ submit (form → URL)
  const onSubmit = (data: ItemFilterFormSchema) => {
    const params: Record<string, string> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    });

    setSearchParams(params);
    setAppliedFilters(buildFilters(data));
  };

  const resetFilters = () => {
    const resetValues = {
      title: "",
      place: "",
      category_id: undefined,
      government_id: undefined,
      city_id: undefined,
      type: "lost" as const,
      date: undefined,
    };

    form.reset(resetValues);
    setSearchParams({});
    setAppliedFilters(buildFilters(resetValues));
  };

  return {
    form,
    onSubmit,
    resetFilters,
    appliedFilters,
    filteredCities,
  };
}

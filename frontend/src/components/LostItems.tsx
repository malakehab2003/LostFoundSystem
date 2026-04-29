import {
  Building2,
  Calendar,
  Captions,
  Landmark,
  List,
  Pin,
  Shapes,
  X,
  Filter,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField from "./CustomerFormField";
import { Form } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  type City,
  type Government,
  type Item,
  type ItemCategory,
} from "@/features/items/itemsType";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/components/Dashboard/DashItemInfo";
import { useListItems } from "@/features/items/hooks/useListItems";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "./ui/spinner";
import defaultpage from "@/assets/default-item-image.svg";

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

const LostItems = () => {
  const { governments } = useGovernments();
  const { cities } = useCities();
  const { itemCategories } = useGetItemCategory();
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<ItemFilterFormSchema>({
    resolver: zodResolver(ItemFilterSchema),
    defaultValues: {
      title: "",
      place: "",
      category_id: undefined,
      type: "lost",
      date: undefined,
      government_id: undefined,
      city_id: undefined,
    },
  });

  const selectedGovernment = form.watch("government_id");
  const filteredCities = cities?.filter(
    (city) => city.government_id === selectedGovernment,
  );

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
  const {
    items: filteredItems,
    isLoading,
    error,
  } = useListItems(appliedFilters);

  const onSubmit = (data: ItemFilterFormSchema) => {
    const filters = buildFilters(data);
    setAppliedFilters(filters);
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    form.reset({
      title: "",
      place: "",
      category_id: undefined,
      government_id: undefined,
      city_id: undefined,
      type: "lost",
      date: undefined,
    });
    setAppliedFilters(buildFilters(form.getValues()));
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen">
      <div className="pt-10 text-center px-4 mb-8 flex flex-col items-center justify-between gap-4">
        <h1 className="header">Lost & Found Items</h1>
        <p className="sub-header">
          Search and filter items to find what you're looking for
        </p>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <aside className="w-full md:w-96 flex-shrink-0">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="font-semibold text-foreground/70 flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" /> Filter
              </h2>
              {hasSearched && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-foreground/70 hover:text-foreground/90 underline"
                >
                  Reset
                </button>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="title"
                  label="Title"
                  icon={Captions}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="place"
                  label="Place"
                  icon={Pin}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="government_id"
                  label="Government"
                  options={governments?.map((gov: Government) => ({
                    value: gov.id,
                    label: gov.name,
                  }))}
                  onchange={() => form.setValue("city_id", undefined)}
                  icon={Landmark}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="city_id"
                  label="City"
                  options={filteredCities?.map((city: City) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                  disabled={!selectedGovernment}
                  icon={Building2}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="type"
                  label="Type"
                  icon={Shapes}
                  options={[
                    { label: "Lost", value: "lost" },
                    { label: "Found", value: "found" },
                  ]}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="category_id"
                  label="Category"
                  options={itemCategories?.map((category: ItemCategory) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  icon={List}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="date"
                  label="Date"
                  placeholder="Select date of loss or finding"
                />
                <Button
                  type="submit"
                  size={"lg"}
                  variant={"default"}
                  className="w-full align-center self-center mx-auto"
                  disabled={isLoading}
                >
                  Apply Filters
                </Button>
              </form>
            </Form>
          </aside>

          <main className="w-full">
            {hasSearched && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary/90">
                  Found{" "}
                  <span className="font-semibold">
                    {filteredItems?.length || 0}
                  </span>{" "}
                  items
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center justify-center items-center py-12">
                <Spinner className="w-8 h-8 place-self-center text-primary" />{" "}
                Searching for items...
              </div>
            )}

            {/* Empty State */}
            {!isLoading &&
              !error &&
              hasSearched &&
              filteredItems?.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <X className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No items found</p>
                    <p className="text-sm text-slate-500">
                      Try adjusting your filters to find what you're looking for
                    </p>
                  </div>
                </div>
              )}

            {!isLoading && filteredItems && filteredItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: Item) => (
                  <Link
                    key={item.id}
                    to={`/lost/${item.id}`}
                    className="group rounded-lg border bg-white shadow-xs hover:shadow-sm transition-shadow duration-300 flex flex-col h-full"
                  >
                    <div className="mx-auto relative h-56 w-full rounded-lg bg-slate-50 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={item.image?.[0]?.url || defaultpage}
                        alt={item.title}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={
                            item.type === "lost" ? "destructive" : "default"
                          }
                          className="capitalize font-semibold"
                        >
                          {item.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-foreground-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-foreground-600 line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}

                      <div className="space-y-1 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-foreground-500">
                          <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium">{item.place}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground-500">
                          <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>
                            {item.city?.name}, {item.government?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground-500">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LostItems;

import {
  Building2,
  Calendar,
  Captions,
  Landmark,
  List,
  Pin,
  Shapes,
  Search,
  X,
  AlertCircle,
  Loader,
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

// Filter Schema - all fields optional except type
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

  // Build query filters
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
      {/* Header Section */}
      <div className="pt-10 text-center px-4 mb-8 flex flex-col items-center justify-between gap-4">
        <h1 className="header">Lost & Found Items</h1>
        <p className="sub-header">
          Search and filter items to find what you're looking for
        </p>
      </div>
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="w-full md:w-70 flex-shrink-0">
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

          <main className="lg:col-span-3">
            {/* Results Header */}
            {hasSearched && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Found{" "}
                  <span className="font-semibold">
                    {filteredItems?.length || 0}
                  </span>{" "}
                  items
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-slate-600">Searching for items...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Error loading items</p>
                  <p className="text-sm text-slate-500">
                    {error instanceof Error
                      ? error.message
                      : "Please try again"}
                  </p>
                </div>
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

            {/* Initial State */}
            {!hasSearched && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">
                    Start searching for items
                  </p>
                  <p className="text-sm text-slate-500">
                    Use the filters on the left to find lost or found items
                  </p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && filteredItems && filteredItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: Item) => (
                  <Link key={item.id} to={`/lost/${item.id}`} className="group">
                    <div className="h-full bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden">
                      {/* Image Container */}
                      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={
                            item.images?.[0]?.image_url ||
                            "https://images.unsplash.com/photo-1606107557529-da4dd904007d?w=500&h=500&fit=crop"
                          }
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1606107557529-da4dd904007d?w=500&h=500&fit=crop";
                          }}
                        />
                        {/* Type Badge */}
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

                      {/* Content */}
                      <div className="p-4">
                        {/* Category Badge */}
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs">
                            {item.category?.name || "Uncategorized"}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>

                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}

                        {/* Location Info */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-medium">{item.place}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>
                              {item.city?.name}, {item.government?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          View Details
                        </Button>
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

import {
  Building2,
  Calendar,
  Captions,
  Landmark,
  List,
  Pin,
  Shapes,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField from "../components/CustomerFormField";
import { Form } from "@/components/ui/form";
import { Link, useParams } from "react-router-dom";
import { useEditItem } from "@/features/items/hooks/useEditItem";
import {
  CreateItemSchema,
  EditItemSchema,
  type City,
  type CreateItemFormSchema,
  type EditItemFormSchema,
  type Government,
  type Item,
  type ItemCategory,
} from "@/features/items/itemsType";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import { MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/components/DashItemInfo";
import { useListItems } from "@/features/items/hooks/useListItems";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const foundItems = [
  {
    id: 1,
    title: "Black Leather Wallet",
    location: "Downtown Central",
    date: "Jan 14, 2026",
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Silver Keychain",
    location: "North Park Area",
    date: "Jan 12, 2026",
    img: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Blue Smartphone",
    location: "Metro Station",
    date: "Jan 13, 2026",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
];

const LostItems = () => {
  const { governments } = useGovernments();
  const { cities } = useCities();
  const { itemCategories } = useGetItemCategory();

  const form = useForm<CreateItemFormSchema>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      title: "",
      place: "",
      category_id: undefined,
      type: "lost",
      date: new Date(),
      government_id: undefined,
      city_id: undefined,
    },
  });
  const selectedGovernment = form.watch("government_id");
  const filteredCities = cities?.filter(
    (city) => city.government_id === selectedGovernment,
  );

  const [appliedFilters, setAppliedFilters] = useState({});

  const { items: filteredItems, isLoading } = useListItems({
    title: appliedFilters.title,
    government: governments?.find((g) => g.id === appliedFilters.government_id)
      ?.name,
    city: filteredCities?.find((c) => c.id === appliedFilters.city_id)?.name,
    place: appliedFilters.place,
    category_id: appliedFilters.category_id,
    type: appliedFilters.type,
    page: 1,
    limit: 50,
  });

  const onSubmit = (data: CreateItemFormSchema) => {
    console.log("data from form", data);
    setAppliedFilters(data); // triggers refetch in useListItems
    console.log(filteredItems);
  };
  return (
    <div className="">
      <div className="pt-10 text-center px-4 mb-8 flex flex-col items-center justify-between gap-4">
        <h1 className="header">Items sorted by best photo match</h1>

        <div className="flex item-center justify-center gap-2">
          <Badge
            variant={"outline"}
            className="text-sm font-semibold leading-tight text-foreground/80"
          >
            <MapPin className="w-4 h-4" /> Nearby Matches
          </Badge>
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-10 flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-70 flex-shrink-0">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="font-semibold text-foreground/70 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" /> Filter
            </h2>
            <button className="text-xs text-foreground/70 hover:text-foreground/90 underline">
              Reset Filters
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Results Grid */}
        <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {appliedFilters &&
            appliedFilters.length > 0 &&
            appliedFilters.map((item: Item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="h-56 w-full">
                  <Link to={`/lost/${item.id}`}>
                    <img
                      className="mx-auto h-full"
                      src={`${item.images[0] || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"}`}
                      alt={item.title}
                    />
                  </Link>
                </div>
                <div className="pt-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <Badge
                      variant={"outline"}
                      className="text-xs font-semibold leading-tight text-foreground/80 line-clamp-2"
                    >
                      {item?.category}
                    </Badge>
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <Link
                      to={`/lost/${item.id}`}
                      className="text-lg font-semibold leading-tight text-foreground/90 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-normal leading-tight text-foreground/70 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-foreground/80 font-semibold">
                    Found In: {item.city}, {item.government}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <Button type="button" variant={"default"}>
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default LostItems;

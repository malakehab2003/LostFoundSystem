import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useAddItemImage } from "@/features/items/hooks/useAddItemImage";
import { Spinner } from "./ui/spinner";
import { FormFieldType } from "./Dashboard/DashItemInfo";
import CustomFormField from "./CustomerFormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "./ui/form";
import DeleteItemImageDialog from "./dialog/DeleteItemImageDialog";

const ImageSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .max(10, "Maximum 10 images allowed")
    .optional(),
});
type ImageFormSchema = z.infer<typeof ImageSchema>;

const ItemImage = ({ itemId }: { itemId: string }) => {
  const { item, isLoading } = useGetItem(Number(itemId!));
  const { addItemImage, isPending: isAdding } = useAddItemImage();

  const form = useForm<ImageFormSchema>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      images: [],
    },
  });

  async function onSubmit(data: ImageFormSchema) {
    try {
      addItemImage({
        owner_id: Number(itemId),
        owner_type: "item",
        images: data.images || [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg shadow-xs">
      {item?.image && item.image.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {item.image.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt="Item"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <DeleteItemImageDialog imageId={img.id!} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Images</h3>
        <Form {...form}>
          <form className="space-y-8">
            <CustomFormField
              fieldType={FormFieldType.FILE_INPUT}
              control={form.control}
              maxFiles={10}
              name="images"
              label="Item Images"
            />

            <Button
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              disabled={isAdding}
              className="w-full"
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload size={18} /> Add Images
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ItemImage;

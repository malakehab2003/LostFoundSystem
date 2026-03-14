import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteAddress } from "@/features/address/hooks/useDeleteAddress";
import { Trash2 } from "lucide-react";

const DeleteAddressDialog = ({ addressId }: { addressId: number }) => {
  const { deleteAddress, isPending } = useDeleteAddress();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-red-400">
          <Trash2 className="w-4 h-4" /> Remove
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Address</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this address?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={() => deleteAddress(addressId)}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAddressDialog;

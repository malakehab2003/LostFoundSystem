import { Trash2 } from "lucide-react";
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

const DeleteAddress = ({ addressId }: { addressId: number }) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant={"link"}
            className="text-red-400 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant={"destructive"}>
              Remove Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteAddress;

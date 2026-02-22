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
import { useState } from "react";
import { Spinner } from "@heroui/react";

const DeleteAccount = ({ userId }: { userId: number }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"lg"}
          disabled={isSubmitting}
          className="text-red-600 bg-red-100/50 hover:bg-red-100/50 hover:text-red-600 disabled:bg-red-500/10 disabled:text-red-400 disabled:cursor-not-allowed"
        >
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account? this will permanently
            delete all the data related to this account and you won't be able to
            recover it.
          </DialogDescription>
        </DialogHeader>
        <form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              type="submit"
              disabled={isSubmitting}
              className="disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Deleting...</span>
                  <Spinner
                    data-icon="inline-end"
                    variant="simple"
                    color="white"
                  />
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;

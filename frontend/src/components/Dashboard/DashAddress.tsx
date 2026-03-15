import { Plus } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import AddressDialog from "../dialog/AddressDialog";
import { useGetAddresses } from "@/features/address/hooks/useGetAddresses";
import { Spinner } from "../ui/spinner";
import emptyAddresses from "@/assets/no-addressess.svg";
import DeleteAddressDialog from "../dialog/DeleteAddressDialog";

const DashAddress = () => {
  const { addresses, isLoading } = useGetAddresses();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="header text-center mb-10">Your Addresses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Empty className="aspect-[5/3] border-2 border-dashed border-foreground/40 rounded-2xl hover:border-primary hover:bg-gray-100 transition-all group">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="p-4 bg-slate-50 rounded-full group-hover:bg-primary/10 transition-colors"
            >
              <Plus className="w-10 h-10 text-violet-400 group-hover:text-primary transition-colors" />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyContent>
            <AddressDialog type={"create"} />
          </EmptyContent>
        </Empty>
        {isLoading ? (
          <div className="text-center py-20 justify-center items-center">
            <Spinner className="w-8 h-8 place-self-center text-primary" />
          </div>
        ) : addresses && addresses.length > 0 ? (
          addresses?.map((addr) => (
            <div
              key={addr.id}
              className="relative flex flex-col bg-slate-50 px-5 py-4 aspect-[5/3] border-2 border-foreground/30 rounded-2xl hover:border-primary/80 hover:bg-gray-100 transition-all"
            >
              <div className="flex-1 space-y-2 overflow-hidden">
                <h2 className="text-lg sub-header">{addr.name}</h2>
                <div className="text-foreground/70 text-[15px] tracking-wide font-semibold capitalize">
                  <p className="">{addr.address}</p>
                  <p>{addr.city.name},</p>
                  <p>{addr.postal_code}</p>
                </div>
              </div>

              <div className="mt-3 pt-1 border-t border-gray-100 flex items-center gap-4">
                <AddressDialog address={addr} type={"edit"} />
                <DeleteAddressDialog addressId={addr.id} />
              </div>
            </div>
          ))
        ) : (
          <div className=" text-foreground/80 text-base font-semibold tracking-tight text-center p-10">
            there are no addresses yet to display, start by adding one to be
            able placing orders.
            <img
              src={emptyAddresses}
              alt="No addresses"
              className="mx-auto mt-6 rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashAddress;

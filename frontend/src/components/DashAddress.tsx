import { Plus } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import AddressDialog from "./dialog/AddressDialog";
import { useGetAddresses } from "@/features/address/hooks/useGetAddresses";
import { Spinner } from "./ui/spinner";
import emptyAddresses from "@/assets/no-addressess.svg";
import DeleteAddressDialog from "./dialog/DeleteAddressDialog";

const DashAddress = () => {
  const { addresses, isLoading } = useGetAddresses();
  console.log(addresses);
  return (
    <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 font-sans ">
      <div className="max-w-6xl mx-auto">
        <h1 className="header mb-10">Your Addresses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Address Card */}
          <Empty className="aspect-[4/3] border-2 border-dashed border-slate-300 rounded-3xl hover:border-primary hover:bg-green-50/30 transition-all group">
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
                className="relative aspect-[4/3] flex flex-col bg-slate-50 border border-slate-100 rounded-3xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-2overflow-hidden">
                  <h2 className="text-lg font-semibold text-slate-900 capitalize truncate">
                    {addr.name}
                  </h2>
                  <div className="text-slate-900 text-[15px] tracking-wide font-semibold capitalize">
                    <p className="">{addr.address}</p>
                    <p>{addr.city.name},</p>
                    <p>{addr.postal_code}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-4">
                  <AddressDialog address={addr} type={"edit"} />
                  <DeleteAddressDialog addressId={addr.id} />
                </div>
              </div>
            ))
          ) : (
            <div className=" text-foreground/80 text-lg font-semibold tracking-wide text-center py-20">
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
    </div>
  );
};

export default DashAddress;

import { Edit3, Plus, Trash2 } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
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
import DeleteAddress from "./dialog/DeleteAddress";
import EditAddress from "./dialog/EditAddress";

const addresses = [
  {
    id: 62,
    name: "home",
    address: "23 elnahas street",
    city: "tanta",
    state: "gharbia",
    country: "egypt",
    postal_code: "21311",
  },
  {
    id: 61,
    name: "home",
    address: "23 elnahas street",
    city: "tanta",
    state: "gharbia",
    country: "egypt",
    postal_code: "21311",
  },
  {
    id: 62,
    name: "home",
    address: "23 elnahas street",
    city: "tanta",
    state: "gharbia",
    country: "egypt",
    postal_code: "21311",
  },
];

const DashAddress = () => {
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
              <Button variant={"default"} className="cursor-pointer">
                Add Address
              </Button>
            </EmptyContent>
          </Empty>

          {addresses.map((addr) => (
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
                  <p>
                    {addr.city}, {addr.state}
                  </p>
                  <p>{addr.postal_code}</p>
                  <p>{addr.country}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-4">
                <EditAddress address={addr} />
                <DeleteAddress addressId={addr.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashAddress;

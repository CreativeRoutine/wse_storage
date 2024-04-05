
import React from "react";
import Title from "@/components/shared/Title";
import CreatePalet from "@/components/shared/pallets/CreatePalet";
import DisplayPallets from "@/components/shared/displays/DisplayPallets";
import { getPallets } from "@/lib/actions/pallet.action";
import AddPrinterToPalet from "@/components/shared/pallets/AddPrinterToPalet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Storage = async () => {

  const resultPallets = await getPallets({})
  const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))

  return (
    <>
      <Title text="Storage" />
      
      <div className="flex flex-row gap-2 bg-dark-600 rounded-xl border border-dark-350 p-4">
        {
          pallets.map((pallet:any) => {
            return(
              <div key={pallet._id} className="w-1/2 max-w-1/2 flex flex-col bg-secondary-200 px-8 mb-6 py-6 rounded-xl border border-dark-350 shadow-lg">
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-semibold">Location:</div>
                  <div className="font-bold text-lime-400">{pallet.location}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-semibold">Printers inside</div>
                  <div className="font-bold text-sky-400">{pallet.printers.length}</div>
                </div>
                {/* <Button type="submit" > */}
                  <Link href={`/storage/${pallet.sn}`} className="flex justify-center items-center rounded-lg bg-primary-500 text-white mt-3 p-4">
                    Edit Pallet
                  </Link>
                {/* </Button> */}
              </div>
            )
          }
        )}
      </div>
    </>
  );
};

export default Storage;

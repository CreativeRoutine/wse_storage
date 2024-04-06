
import React from "react";
import Title from "@/components/shared/Title";
import { getPallets } from "@/lib/actions/pallet.action";
import Link from "next/link";

const Storage = async () => {

  const resultPallets = await getPallets({})
  const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))

  return (
    <>
      <Title text="Storage" />
      
      <div className="flex flex-wrap gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">
        {
          pallets.map((pallet:any) => {
            return(
              <div key={pallet._id} className="flex flex-col w-1/3 max-w-1/3 bg-secondary-200 px-6 mb-2 py-8 rounded-xl border border-dark-350 shadow-lg">
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-semibold">Location:</div>
                  <div className="font-bold text-lime-400">{pallet.location}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-semibold">Printers inside</div>
                  <div className="font-bold text-sky-400">{pallet.printers.length}</div>
                </div>
                
                  <Link href={`/storage/${JSON.parse(JSON.stringify(pallet.sn))}`} className="flex justify-center items-center rounded-lg bg-primary-500 text-white mt-3 p-4">
                    Edit Pallet
                  </Link>
                
              </div>
            )
          }
        )}
      </div>
    </>
  );
};

export default Storage;

"use server"
import AssignName from "@/components/shared/parts/AssignName"
import DeletePrinterPart from "@/components/shared/parts/DeletePrinterPart"
import { getPartsByProductNumber } from "@/lib/actions/parts.action"
import { getAllPartsList } from "@/lib/actions/partsList.action"
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/tw/description-list'
import { Subheading } from '@/components/tw/heading'
import { PartsSwitcher } from "@/components/shared/forms/PartsSwitcher"
import MaxPartsInput from "@/components/shared/forms/MaxPartsInput"
import Title from "@/components/shared/Title"
import Link from "next/link";

const DisplayPartsSettings = async ({ params }: { params: { productNumber: string } }) => {
  const { productNumber } = params;
  const response:any = await getPartsByProductNumber({ productNumber });
  // const printerResponse = JSON.parse(JSON.stringify(response));
  // console.log(typeof response.parts)
  
  const parts = JSON.parse(JSON.stringify(response));
  console.log(parts._id)

  const partsListResponse = await getAllPartsList();
  // const partsList = JSON.parse(JSON.stringify(partsListResponse));
  // console.log("parts ====>",Object.entries(parts).length)
  // console.log("partsList ====>",partsListResponse)
  // console.log("response[0] ====>",response[0])
  // console.log("parts ====>",parts[0])
  // console.log("parts ====>",parts)

  return (
    <>
      <div className="flex gap-2">
        
        <Title text={`Printer parts for "${productNumber}"`}  link="/settings/printer-parts" linkText="Back" />
      </div>
      {/* MAINTENANCE SETTINGS'S FUNCTIONS/INPUTs */}
      {/* <div className="flex gap-3 bg-dark-600 rounded-xl p-4">
        <div className="w-1/3 bg-secondary-200 px-6 mb-1 py-6 rounded-xl border border-dark-350 shadow-lg">
          <AssignName id={JSON.stringify(resp[0]._id)} />
        </div>
        <div className="w-1/3 bg-secondary-200 px-6 mb-1 py-6 rounded-xl border border-dark-350 shadow-lg">
          <DeletePrinterPart id={JSON.stringify(resp[0]._id)} />
        </div>
      </div> */}

      <div className="mt-4 flex flex-col lg:flex-row gap-3 bg-dark-600 rounded-xl border border-dark-350 p-4">
        {/* PRINTER PARTS SETTINGS */}
        <div className="w-1/2 bg-secondary-200 rounded-lg p-4 border border-dark-350 shadow-lg"> 
          <Subheading className="!text-white !text-lg">Printer parts settings</Subheading>

            <DescriptionList className="mt-4" >
              <DescriptionTerm className="text-white">Printer name:</DescriptionTerm>
              <DescriptionDetails className="!text-white">
                
                {parts.printerName ? parts.printerName : <div className="text-red-500 ">Name not set</div>}
              </DescriptionDetails>

              <DescriptionTerm className="text-white">Printer's product number</DescriptionTerm>
              <DescriptionDetails className="!text-white">
                {parts.productNumber ? parts.productNumber : <span className="text-red-500">Not set</span>}
              </DescriptionDetails>

              <DescriptionTerm>Parts</DescriptionTerm>
              <DescriptionDetails className="!text-white">
                {parts.parts.length}
              </DescriptionDetails>
              
              <DescriptionTerm>Parts list</DescriptionTerm>
              <DescriptionDetails className="!text-white">
                <ul>
                  {
                    parts.parts && parts.parts.length > 0 ? parts.parts.map((partName:any) => (partName.partsName ? 
                    <li key={partName.partsName} className="flex w-full justify-between items-center border-b border-gray-700 py-2">
                      {partName.partsName}
                      <MaxPartsInput initialLimit={partName.maxParts} printerPN={parts.productNumber} label={partName.partsName} />
                    </li> : 
                    null)) :
                     "No parts added"
                  }
                  
                </ul>
              </DescriptionDetails>
            </DescriptionList>

        </div>

        {/* SWITCHERS */}
        <div className="w-1/2 bg-secondary-200 rounded-lg p-4 border border-dark-350 shadow-lg"> 
          <Subheading className="!text-white !text-lg">Add parts to be disassembled</Subheading>

          <ul className="mt-2">
            {
              partsListResponse && partsListResponse.partName.length > 0 ? partsListResponse.partName.map((part:string) => {
                // Check if partName is in parts array
                const state = parts.parts.some((item:any) => item.partsName === part);
                
                return (
                  <li key={part} className="py-1">
                    <PartsSwitcher 
                      label={part}
                      state={state} 
                      printerPN={parts.productNumber} 
                    />
                  </li>
                );
              }) : (
                <li className="text-white">No parts added! Check Parts list settings.</li>
              )
            }
          </ul>
        </div>
      </div>
    </>
  );
};

export default DisplayPartsSettings;
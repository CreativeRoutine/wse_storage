"use server";

// import React from 'react'
import { formatTime } from "@/lib/utils";
// import Link from "next/link";
import { getPrinters } from "@/lib/actions/printer.action";

interface Props {
  parts: any;
}

const DisplayParts = async ({ parts }: Props) => {
  if (parts.length == 0) {
    return (
      <tr>
        <td className="pt-6 text-white text-left">
          You didn't add any part yet!
        </td>
      </tr>
    );
  }

  return (
    <>
      {parts.map((printer: any, i: any) => (
        <tr key={printer._id}>
          {/* PREVIEW */}
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div className="mr-2">{i + 1}.</div>
              <div className="h-11 w-11 flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-md"
                  src={
                    printer.preview
                      ? printer.preview
                      : "/assets/printers_preview/NoPreview.webp"
                  }
                  alt=""
                />
              </div>
            </div>
          </td>
          {/* Printer make/name */}
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">
              {printer.printerName ? (
                printer.printerName
              ) : (
                <span className="text-red-500">Not set</span>
              )}
            </div>
          </td>
          {/* Parts types */}
          {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.productNumber ? <span className="font-bold text-lg" >{printer.productNumber}</span> : <span className="text-red-500">No parts added TYPES</span> }</div>
          </td> */}
          {/* Parts qtty all */}
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">
              {printer.parts ? (
                printer.parts.length
              ) : (
                <span className="text-red-500">To be added later</span>
              )}
            </div>
          </td>

          {/* Parts max qtty */}
          {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.maxParts ? printer.maxParts : <span className="text-red-500">To be added later</span> }</div>
          </td> */}

          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            {/* <a href={`/settings/printer-parts/${printer._id}`} className="text-white z-0 border border-white hover:border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg px-8 py-3 mr-2">
              View
            </a> */}
            <a
              href={`/settings/printer-parts/${printer.printerName}`}
              className="text-indigo-600 z-0 border border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg px-8 py-3"
            >
              Edit
            </a>
          </td>
        </tr>
      ))}
    </>
  );
};

export default DisplayParts;

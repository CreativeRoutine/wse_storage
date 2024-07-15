"use server"

import { error } from 'console'
import { connectToDatabase } from '../mongoose'
import { SearchParams } from './shared.types'
import Printer from '@/database/printer.model'
import Supplier from '@/database/supplier.model'
import User from '@/database/user.model'
import Pallet from '@/database/pallet.model'

const SearchableTypes = ['printer', 'supplier', 'pallet', 'user']

export async function globalSearch(params: SearchParams){
  try{
    connectToDatabase()

    const {query, type} = params;

    const regexQuery = {$regex: query, $options: 'i'}

    let results = [];

    let modelsAndTypes = [
      { model: Printer, searchField: "barcode ponumber name", type: 'printer' },
      { model: Supplier, searchField: 'ponumber', type: 'supplier' },
      { model: Pallet, searchField: "barcode", type: 'pallet'},
      { model: User, searchField: "username", type: 'user' },
    ]

    const typeLower = type?.toLowerCase();

    if(!typeLower || !SearchableTypes.includes(typeLower)){
      // SEARCH ACROSS EVERYTHING

      for (const {model, searchField, type} of modelsAndTypes){
        const queryResults = await model
        .find({[searchField]: regexQuery})
        .limit(2)

        results.push(...queryResults.map((item) => ({
          barcode: type === 'printer'
            ? `Printers containing ${query}`
            : item[searchField],
            type,
            id: type === 'user'
              ? item.clerkId
              : type==='printer'
                ?item.sn
                : item._id
          }))

        )
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      console.log("modelInfo", {modelInfo, type})

      if(!modelInfo) {throw new Error("Invalid search type")}

        const queryResults = await modelInfo.model
        .find({[modelInfo.searchField]: regexQuery})
        .limit(8)

        results = queryResults.map((item) => ({
          sn: type === 'printer'
            ? `Printers containing ${query}`
            : item[modelInfo.searchField],
          type,
          id: type === 'user'
            ? item.clerkId
            : type==='printer'
              ?item.sn
              : item._id
            
        }))
    }

    return JSON.stringify(results)
  }catch(e){
      console.log("Error connecting to database", e)
      throw error
  }
}
"use server"

import { connectToDatabase } from '../mongoose'
import { SearchParams } from './shared.types'
import Printer from '@/database/printer.model'
import Supplier from '@/database/supplier.model'
import User from '@/database/user.model'
import Pallet from '@/database/pallet.model'

const SearchableTypes = ['printer', 'supplier', 'pallet', 'user']

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: 'i' };
    
    let results = [];

    const modelsAndTypes = [
      { model: Printer, searchFields: ["barcode", "sn", "productNumber", "name"], type: 'printer' },
      { model: Supplier, searchFields: ['ponumber', 'name'], type: 'supplier' },
      { model: Pallet, searchFields: ["barcode"], type: 'pallet' },
      { model: User, searchFields: ["username", "name"], type: 'user' },
    ]

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // SEARCH ACROSS EVERYTHING

      for (const { model, searchFields, type } of modelsAndTypes) {
        const searchConditions = searchFields.map(field => ({ [field]: regexQuery }));
        const queryResults = await model.find({ $or: searchConditions }).limit(4);

        results.push(
          ...queryResults.map((item) => ({
            title: type === 'printer' ? `Printer containing ${query}` : item.name || item.barcode || item.sn || item.productNumber, 
            type,
            id: type === 'user' ? item.clerkId : item._id
          }))
        );
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const searchConditions = modelInfo.searchFields.map(field => ({ [field]: regexQuery }));
      const queryResults = await modelInfo.model.find({ $or: searchConditions }).limit(8);

      results = queryResults.map((item) => ({
        title: type === 'printer' ? `Printer containing ${query}` : item.name || item.barcode || item.sn || item.ponumber,
        type,
        id: type === 'user' ? item.clerkId : item._id
      }));
    }

    return JSON.stringify(results);
  } catch (e) {
    console.log("Error connecting to database", e);
    throw e;
  }
}

export async function printerSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: 'i' };
    
    let results = [];

    const modelsAndTypes = [
      { model: Printer, searchFields: ["barcode", "sn", "productNumber", "name"], type: 'printer' },
      { model: Supplier, searchFields: ['ponumber', 'name'], type: 'supplier' },
      { model: Pallet, searchFields: ["barcode"], type: 'pallet' },
      { model: User, searchFields: ["username", "name"], type: 'user' },
    ]

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // SEARCH ACROSS EVERYTHING

      for (const { model, searchFields, type } of modelsAndTypes) {
        const searchConditions = searchFields.map(field => ({ [field]: regexQuery }));
        const queryResults = await model.find({ $or: searchConditions }).limit(4);

        results.push(
          ...queryResults.map((item) => ({
            title: type === 'printer' ? `Printer containing ${query}` : item.name || item.barcode || item.sn || item.productNumber, 
            type,
            id: type === 'user' ? item.clerkId : item._id
          }))
        );
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const searchConditions = modelInfo.searchFields.map(field => ({ [field]: regexQuery }));
      const queryResults = await modelInfo.model.find({ $or: searchConditions }).limit(8);

      results = queryResults.map((item) => ({
        title: type === 'printer' ? `Printer containing ${query}` : item.name || item.barcode || item.sn || item.ponumber,
        type,
        id: type === 'user' ? item.clerkId : item._id
      }));
    }

    return JSON.stringify(results);
    
  } catch (e) {
    console.log("Error connecting to database", e);
    throw e;
  }
}

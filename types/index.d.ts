export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Users {
  id: string;
  role: string;
  name: string;
  listOfPrinters: any;
  printersMade: number;
  returns: boolean;
  returnsQtty: number;
  PrintersReturned: PrintersReturned[];
  averageTime: number;
}

export interface Printers {
  id: string;
  serial: string;
  make: string;
  techId: string;
  techStart: any;
  price: number;
  techEnd: any;
  techTime: number;
  cleanerId: string;
  cleanerStart: any;
  cleanerEnd: any;
  cleanerTime: number;
  partsReplaced: any;
  returned: boolean;
  returnedQtty: number;
  returnedReason: any;
}

export interface Parts {
  model: string;
  leftSide: number;
  leftSideMax: number;
  rightSide: number;
  rightSideMax: number;
  top: number;
  topMax: number;
  screens: number;
  screensMax: number;
  front: number;
  frontMax: number;
  rearDoors: number;
  rearDoorsMax: number;
  trays: number;
  traysMax: number;
  fuser: number;
  fuserMax: number;
  rolls: number;
  rollsMax: number;
}

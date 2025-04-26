export type TableStatus = "available" | "occupied" | "reserved";

export type Table = {
  id: number;
  number: string;
  capacity: number;
  location: string;
  status: TableStatus;
};

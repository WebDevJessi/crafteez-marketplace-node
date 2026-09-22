import { RowDataPacket } from "mysql2";

export interface Product extends RowDataPacket {
    item_name: string;
    price: string;
    item_description: string;
    id?: number;
    image_url: string;
}
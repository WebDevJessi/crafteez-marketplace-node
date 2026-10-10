import { Product } from "./product.model";

import { connection } from "../../database";

export class ProductRepository {
    readAll(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            connection.query<Product[]>('SELECT * FROM product_list', (error: any, results: Product[] | PromiseLike<Product[]>) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    readyById(id: number): Promise<Product | null> {
        return new Promise((resolve, reject) => {
            connection.query<Product[]>('SELECT * FROM product_list WHERE id = ?', [id],
                (err: any, res: (Product | PromiseLike<Product | null> | null)[]) => {
                    if (err) reject(err)
                        else resolve(res?.[0])

                }
            )
        });
    }

}
/*
基本的な実装
例外とか考えずにざっくり書くとこうなるよねという実装
*/

export interface User {
  userId: string;
}
export interface Item {
  itemId: string;
  name: string;
  price: number;
}

export interface CreditCard {
  cardNumber: string;
  expireDate: string;
  securityCode: string;
}
export interface DeliveryAddress {
  address: string;
  zipCode: string;
}
/**
 * 在庫の無い商品を見つける
 * @param items
 * @returns 在庫が無い商品の一覧
 */
export function getNoStockItems(items: Item[]): Item[] {
  return [];
}
/**
 * 商品の合計を計算する
 * @param user
 * @param items
 * @returns
 */
export function calculatePrice(user: User, items: Item[]): number {
  return items.reduce((acc, item) => acc + item.price, 0);
}
/**
 * クレジットカード情報を取得する
 * @param user
 * @returns
 */
export function getCreditCard(user: User): CreditCard | null {
  return {
    cardNumber: "1234",
    expireDate: "12/12",
    securityCode: "123",
  };
}
/**
 * 住所情報を取得する
 * @param user
 * @returns
 */
export function getDeliveryAddress(user: User): DeliveryAddress | null {
  return { address: "東京都", zipCode: "123-4567" };
}
/**
 * クレジットカードで支払う
 * @param creditCard
 * @param price
 * @returns レシート番号
 */
export function payByCreditCard(creditCard: CreditCard, price: number): string {
  return "123456";
}
export function deliverItems(
  deliveryAddress: DeliveryAddress,
  items: Item[]
): void {
  console.log("商品を配達します");
}

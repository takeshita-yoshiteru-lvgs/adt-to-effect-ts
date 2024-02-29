import { Either, right, left } from "effect/Either";
/*
TypeScriptの場合、非同期処理も多用するためPromiseも取り扱わないといけない
一部の関数がPromiseに変わった時にどうなるかのサンプルコード
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

export type HasNoStockItems = {
  action: "CheckStocks";
  error: "HasNoStockItems";
  noStockItems: Item[];
};
/**
 * 在庫の無い商品を見つける
 * @param items
 * @returns 在庫が無い商品の一覧
 */
export function checkStocks(items: Item[]): Either<HasNoStockItems, void> {
  return right(undefined);
}

export type CreditCardNotRegistered = {
  action: "GetCreditCard";
  error: "NotRegistered";
};
export type CreditCardExpired = {
  action: "GetCreditCard";
  error: "Expired";
  expiredAt: Date;
};
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
export function getCreditCard(
  user: User
): Either<CreditCardNotRegistered | CreditCardExpired, CreditCard> {
  return right({
    cardNumber: "1234",
    expireDate: "12/12",
    securityCode: "123",
  });
}

export type DeliveryAddressNotRegistered = {
  action: "GetDeliveryAddress";
  error: "NotRegistered";
};
export type BadDeliveryAddress = {
  action: "GetDeliveryAddress";
  error: "BadAddress";
};
/**
 * 住所情報を取得する
 * @param user
 * @returns
 */
export function getDeliveryAddress(
  user: User
): Either<BadDeliveryAddress | DeliveryAddressNotRegistered, DeliveryAddress> {
  return right({ address: "東京都", zipCode: "123-4567" });
}

export type PaymentSuccess = {
  action: "PayByCreditCard";
  result: "Success";
  receiptNo: string;
};
export type PaymentNotNeeded = {
  action: "PayByCreditCard";
  result: "PaymentNotNeeded";
};

export type PaymentLimit = {
  action: "PayByCreditCard";
  error: "PaymentLimit";
  message: string;
};
export type PaymentNetworkError = {
  action: "PayByCreditCard";
  error: "NetworkError";
  message: string;
};
/**
 * クレジットカードで支払う
 * @param creditCard
 * @param price
 * @returns レシート番号
 */
export function payByCreditCard(
  creditCard: CreditCard,
  price: number
): Promise<
  Either<PaymentLimit | PaymentNetworkError, PaymentSuccess | PaymentNotNeeded>
> {
  return Promise.resolve(
    right({
      action: "PayByCreditCard",
      result: "Success",
      receiptNo: "1234-5678-9012",
    })
  );
}

export type DeliverOutOfArea = {
  action: "DeliverItems";
  error: "OutOfArea";
  message: string;
};
export function deliverItems(
  deliveryAddress: DeliveryAddress,
  items: Item[]
): Either<DeliverOutOfArea, void> {
  return right(undefined);
}

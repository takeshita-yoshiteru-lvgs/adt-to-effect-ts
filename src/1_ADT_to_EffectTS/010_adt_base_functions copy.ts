/*
 代数的データ型(ADT)を導入することで、エラーを型で表現出来るように
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
  success: false;
  action: "CheckStocks";
  error: "HasNoStockItems";
  noStockItems: Item[];
};

/**
 * 在庫の無い商品を見つける
 * @param items
 * @returns 在庫が無い商品の一覧
 */
export function checkStocks(items: Item[]): "OK" | HasNoStockItems {
  // 戻り値に発生し得るエラー情報が含まれるため、型定義を見るだけでエラーがわかる
  // エラーの場合は例外ではなく、戻り値として返す
  return {
    success: false,
    action: "CheckStocks",
    error: "HasNoStockItems",
    noStockItems: items,
  };
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

export type CreditCardNotRegistered = {
  success: false;
  action: "GetCreditCard";
  error: "NotRegistered";
};
export type CreditCardExpired = {
  success: false;
  action: "GetCreditCard";
  error: "Expired";
  expiredAt: Date;
};
/**
 * クレジットカード情報を取得する
 * @param user
 * @returns
 */
export function getCreditCard(
  user: User
):
  | { success: true; creditCard: CreditCard }
  | CreditCardNotRegistered
  | CreditCardExpired {
  return {
    success: true,
    creditCard: {
      cardNumber: "1234",
      expireDate: "12/12",
      securityCode: "123",
    },
  };
}

export type DeliveryAddressNotRegistered = {
  success: false;
  action: "GetDeliveryAddress";
  error: "NotRegistered";
};
export type BadDeliveryAddress = {
  success: false;
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
):
  | { success: true; deliveryAddress: DeliveryAddress }
  | BadDeliveryAddress
  | DeliveryAddressNotRegistered {
  return {
    success: true,
    deliveryAddress: { address: "東京都", zipCode: "123-4567" },
  };
}

export type PaymentSuccess = {
  success: true;
  action: "PayByCreditCard";
  result: "Success";
  receiptNo: string;
};
/**
 * 合計金額が0円の場合、決済不要
 */
export type PaymentNotNeeded = {
  success: true;
  action: "PayByCreditCard";
  result: "PaymentNotNeeded";
};

export type PaymentLimit = {
  success: false;
  action: "PayByCreditCard";
  error: "PaymentLimit";
  message: string;
};
export type PaymentNetworkError = {
  success: false;
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
): PaymentSuccess | PaymentNotNeeded | PaymentLimit | PaymentNetworkError {
  // 成功パターンも複数定義可能
  return {
    success: true,
    action: "PayByCreditCard",
    result: "Success",
    receiptNo: "123456",
  };
}

export type DeliverOutOfArea = {
  success: false;
  action: "DeliverItems";
  error: "OutOfArea";
  message: string;
};

export function deliverItems(
  deliveryAddress: DeliveryAddress,
  items: Item[]
): "Success" | DeliverOutOfArea {
  return "Success";
}

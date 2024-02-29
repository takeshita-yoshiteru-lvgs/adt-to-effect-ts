import {
  BadDeliveryAddress,
  CreditCardExpired,
  CreditCardNotRegistered,
  DeliverOutOfArea,
  DeliveryAddressNotRegistered,
  HasNoStockItems,
  Item,
  PaymentLimit,
  PaymentNetworkError,
  User,
  calculatePrice,
  checkStocks,
  deliverItems,
  getCreditCard,
  getDeliveryAddress,
  payByCreditCard,
} from "./010_adt_base_functions copy";

type PurchaseSuccess = {
  result: "Success";
  receiptNo: string;
};

/**
 * 型で発生しうるエラーがわかる
 * これはサンプルコードなので型定義を明示しているが、普段は型推論で良い
 */
export type PurchaseResult =
  | PurchaseSuccess
  | HasNoStockItems
  | CreditCardNotRegistered
  | CreditCardExpired
  | DeliveryAddressNotRegistered
  | BadDeliveryAddress
  | PaymentLimit
  | PaymentNetworkError
  | DeliverOutOfArea;

function purchaseItems(user: User, items: Item[]): PurchaseResult {
  const stockResult = checkStocks(items);
  if (stockResult !== "OK") {
    return stockResult;
  }
  const creditCardResult = getCreditCard(user);
  if (!creditCardResult.success) {
    return creditCardResult;
  }
  const deliveryAddressResult = getDeliveryAddress(user);
  if (!deliveryAddressResult.success) {
    return deliveryAddressResult;
  }
  const price = calculatePrice(user, items);
  const payResult = payByCreditCard(creditCardResult.creditCard, price);

  if (!payResult.success) {
    return payResult;
  }
  const deliverResult = deliverItems(
    deliveryAddressResult.deliveryAddress,
    items
  );
  if (deliverResult !== "Success") {
    return deliverResult;
  }
  if (payResult.result === "Success") {
    return {
      result: "Success",
      receiptNo: payResult.receiptNo,
    };
  } else {
    return {
      result: "Success",
      receiptNo: "----",
    };
  }
}

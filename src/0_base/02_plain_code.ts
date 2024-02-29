import {
  User,
  Item,
  getNoStockItems,
  calculatePrice,
  getDeliveryAddress,
  payByCreditCard,
  deliverItems,
  getCreditCard,
} from "./01_base_functions";

class StockError extends Error {
  constructor(items: Item[]) {
    super(items.map((item) => item.name).join(",") + "の在庫がありません");
  }
}
class CreditCardError extends Error {
  constructor() {
    super("クレジットカードの登録がありません");
  }
}
class DeliveryAddressError extends Error {
  constructor() {
    super("住所登録がありません");
  }
}
class CreditCardTransactionError extends Error {
  constructor() {
    super("クレジットカード決済に失敗しました");
  }
}

class DeliverError extends Error {
  constructor() {
    super("配送エリア外です");
  }
}
/**
 * 商品を購入する
 * @param user
 * @param items
 * @returns
 * PROBREM: ソースコード(またはコメント)を読まないと、どんな例外が発生するかわからない
 * @throws StockError 在庫が無い商品がある
 * @throws CreditCardError クレジットカードの登録が無い
 */
export function purchaseItems(user: User, items: Item[]): string {
  const noStockItems = getNoStockItems(items);
  if (noStockItems.length > 0) {
    // PROBREM: エラー状態がドメインルールに昇華出来ていない
    throw new StockError(noStockItems);
  }
  const price = calculatePrice(user, items);
  const creditCard = getCreditCard(user);
  if (!creditCard) {
    // PROBREM: 登録無しや期限切れなど、エラーの種類も出したいがその情報の受け渡しが難しい
    throw new CreditCardError();
  }
  const deliveryAddress = getDeliveryAddress(user);
  if (!deliveryAddress) {
    throw new DeliveryAddressError();
  }
  let receiptNo = "";
  try {
    receiptNo = payByCreditCard(creditCard, price);
  } catch {
    throw new CreditCardTransactionError();
  }
  try {
    deliverItems(deliveryAddress, items);
  } catch {
    throw new DeliverError();
  }
  return receiptNo;
}

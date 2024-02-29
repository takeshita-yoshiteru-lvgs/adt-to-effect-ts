import { isLeft, isRight, Either, right, left } from "effect/Either";
import {
  Item,
  User,
  calculatePrice,
  checkStocks,
  deliverItems,
  getCreditCard,
  getDeliveryAddress,
  payByCreditCard,
  BadDeliveryAddress,
  CreditCardExpired,
  CreditCardNotRegistered,
  DeliverOutOfArea,
  DeliveryAddressNotRegistered,
  HasNoStockItems,
  PaymentLimit,
  PaymentNetworkError,
} from "./020_either_base_functions";

export type PurchaseSuccess = {
  receiptNo: string;
};

export type PurchaseResult = Either<
  | HasNoStockItems
  | CreditCardNotRegistered
  | CreditCardExpired
  | DeliveryAddressNotRegistered
  | BadDeliveryAddress
  | PaymentLimit
  | PaymentNetworkError
  | DeliverOutOfArea,
  PurchaseSuccess
>;

function purchaseItems(user: User, items: Item[]): PurchaseResult {
  const stockResult = checkStocks(items);
  if (isLeft(stockResult)) {
    return left(stockResult.left);
  }
  const creditCardResult = getCreditCard(user);
  if (isLeft(creditCardResult)) {
    return left(creditCardResult.left);
  }
  const deliveryAddressResult = getDeliveryAddress(user);
  if (isLeft(deliveryAddressResult)) {
    return left(deliveryAddressResult.left);
  }
  const price = calculatePrice(user, items);
  const payResult = payByCreditCard(creditCardResult.right, price);

  if (isLeft(payResult)) {
    return left(payResult.left);
  }
  const deliverResult = deliverItems(deliveryAddressResult.right, items);
  if (isLeft(deliverResult)) {
    return left(deliverResult.left);
  }
  // 成功失敗が明確かつ、統一的に扱えるようになったが、ADTの実装と大した差はない
  // PROBLEM: むしろ型合わせによるボイラープレートも増えている

  if (payResult.right.result === "Success") {
    return right({
      receiptNo: payResult.right.receiptNo,
    });
  } else {
    return right({
      receiptNo: "---",
    });
  }
}

function run() {
  const r = purchaseItems({ userId: "1" }, [
    {
      itemId: "1",
      name: "item1",
      price: 100,
    },
  ]);
  if (isRight(r)) {
    console.log("成功画面に遷移して、結果を表示");
  } else {
    // エラー時の処理もUseCase層で判断して制御可能
    if (r.left.action === "CheckStocks") {
      console.log("在庫なしのエラー画面へ飛ばす");
    } else if (r.left.action === "GetCreditCard") {
      console.log("クレジットカード登録ページに遷移");
    } else {
      //
    }
  }
}

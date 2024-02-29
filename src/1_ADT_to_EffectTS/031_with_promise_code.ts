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
} from "./030_with_promise_base_functions";
import { Either, flatMap, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

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

async function purchaseItems(
  user: User,
  items: Item[]
): Promise<PurchaseResult> {
  return Promise.reject("コンパイルエラーが発生するようになる");

  // return pipe(
  //   checkStocks(items),
  //   flatMap(() => getCreditCard(user)),
  //   flatMap((creditCard) => {
  //     return pipe(
  //       getDeliveryAddress(user),
  //       flatMap((deliveryAddress) => {
  //         const price = calculatePrice(user, items);
  //         return pipe(
  //           payByCreditCard(creditCard, price),
  //           flatMap((payResult) =>
  //             pipe(
  //               deliverItems(deliveryAddress, items),
  //               map(() => payResult)
  //             )
  //           )
  //         );
  //       })
  //     );
  //   }),
  //   map((right) => ({
  //     receiptNo: right.result === "Success" ? right.receiptNo : "---",
  //   }))
  // );
}

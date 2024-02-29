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
} from "./040_task_either_base_functions";
import { Either } from "fp-ts/lib/Either";
import { flatMap, map, fromEither } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

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
  const program = pipe(
    fromEither(checkStocks(items)),
    flatMap(() => TE.fromEither(getCreditCard(user))),
    flatMap((creditCard) => {
      return pipe(
        fromEither(getDeliveryAddress(user)),
        flatMap((deliveryAddress) => {
          const price = calculatePrice(user, items);
          return pipe(
            payByCreditCard(creditCard, price),
            flatMap((payResult) =>
              pipe(
                fromEither(deliverItems(deliveryAddress, items)),
                map(() => payResult)
              )
            )
          );
        })
      );
    }),
    map((right) => ({
      receiptNo: right.result === "Success" ? right.receiptNo : "---",
    }))
  );
  // 構築されたものはTask。実行して初めて計算結果が得られる
  return program();
}

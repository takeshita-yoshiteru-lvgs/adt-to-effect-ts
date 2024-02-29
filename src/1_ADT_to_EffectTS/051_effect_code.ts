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
} from "./050_effect_def";
import { pipe, Effect } from "effect";
import { flatMap, map } from "effect/Effect";
import { Either } from "effect/Either";

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
    checkStocks(items),
    flatMap(() => getCreditCard(user)),
    flatMap((creditCard) => {
      return pipe(
        getDeliveryAddress(user),
        flatMap((deliveryAddress) => {
          const price = calculatePrice(user, items);
          return pipe(
            payByCreditCard(creditCard, price),
            flatMap((payResult) =>
              pipe(
                deliverItems(deliveryAddress, items),
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
  // 構築されたものはEffect。runして初めて実行される
  return Effect.runPromise(Effect.either(program));
}

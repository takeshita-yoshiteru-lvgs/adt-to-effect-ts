import {
  flatMap,
  getOrElse,
  isLeft,
  isRight,
  map,
  mapBoth,
  mapLeft,
  Either,
} from "effect/Either";
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
import { pipe } from "effect";

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
  // ifが無くなる
  // 型合わせのボイラープレートも不要に
  // より宣言的になっている
  return pipe(
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
}

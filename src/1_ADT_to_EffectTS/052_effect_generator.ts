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
  const program = Effect.gen(function* (_) {
    yield* _(checkStocks(items));
    const creditCard = yield* _(getCreditCard(user));
    const deliveryAddress = yield* _(getDeliveryAddress(user));
    const price = calculatePrice(user, items);
    const payResult = yield* _(payByCreditCard(creditCard, price));
    yield* _(deliverItems(deliveryAddress, items));
    return {
      receiptNo: payResult.result === "Success" ? payResult.receiptNo : "---",
    };
  });
  // 構築されたものはEffect。runして初めて実行される
  return Effect.runPromise(Effect.either(program));
}

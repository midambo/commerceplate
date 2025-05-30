"use client";

import { DEFAULT_OPTION } from "@/lib/constants";
import { Cart } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Price from "../Price";
import CloseCart from "./CloseCart";
import { DeleteItemButton } from "./DeleteItemButton";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import OpenCart from "./OpenCart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart }: { cart: Cart | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState('');
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const router = useRouter();

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart?.totalQuantity;
    }

    // Set pathname safely
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <div className="cursor-pointer" aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </div>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full md:h-fit w-full flex-col border-l border-b drop-shadow-lg rounded-bl-md border-neutral-200 bg-body p-6 text-black dark:border-neutral-700 dark:bg-darkmode-body dark:text-white md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Your Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              <div className="w-full h-px absolute bg-dark dark:bg-darkmode-dark left-0 top-16" />

              {!cart?.lines || cart.lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center overflow-hidden p-1">
                  <p className="my-6 text-center text-2xl font-bold">
                    {/* Don't show empty cart message if we just placed an order */}
                    {pathname === '/checkout' ? '' : 'Your cart is empty'}
                  </p>
                  <Link
                    href="/products"
                    className="btn btn-primary w-full"
                    onClick={closeCart}
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cart.lines.map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        },
                      );

                      const merchandiseUrl = createUrl(
                        `/products/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams),
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      ?.altText ||
                                    item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage
                                      ?.url || "/images/product_image404.jpg"
                                  }
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={item.cost.totalAmount.currencyCode}
                                formatOptions={{
                                  style: 'currency',
                                  currency: item.cost.totalAmount.currencyCode,
                                }}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-md border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">
                                    {item.quantity}
                                  </span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Taxes</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                        formatOptions={{
                          style: 'currency',
                          currency: cart.cost.totalTaxAmount.currencyCode,
                        }}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                        formatOptions={{
                          style: 'currency',
                          currency: cart.cost.totalAmount.currencyCode,
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={async () => {
                          closeCart();
                          router.push('/checkout');
                        }}
                        className="btn btn-primary w-full"
                      >
                        Place Order Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

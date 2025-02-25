export const draftOrderCreateMutation = /* GraphQL */ `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        order {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const draftOrderCompleteMutation = /* GraphQL */ `
  mutation draftOrderComplete($id: ID!, $paymentPending: Boolean!) {
    draftOrderComplete(id: $id, paymentPending: true) {
      draftOrder {
        id
        order {
          id
          name
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const cartBuyerIdentityUpdateMutation = /* GraphQL */ `
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
          phone
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const cartDeliveryAddressUpdateMutation = /* GraphQL */ `
  mutation CartDeliveryAddressUpdate($cartId: ID!, $address: MailingAddressInput!) {
    cartDeliveryAddressUpdate(cartId: $cartId, address: $address) {
      cart {
        id
        deliveryGroups {
          deliveryAddress {
            ... on MailingAddress {
              address1
              city
              country
              firstName
              phone
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const cartAttributesUpdateMutation = /* GraphQL */ `
  mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        checkoutUrl
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const cartShippingAddressUpdateMutation = /* GraphQL */ `
  mutation cartShippingAddressUpdate($cartId: ID!, $shippingAddress: MailingAddressInput!) {
    cartShippingAddressUpdate(cartId: $cartId, shippingAddress: $shippingAddress) {
      cart {
        id
        shippingAddress {
          address1
          address2
          city
          country
          firstName
          lastName
          phone
          province
          zip
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartDeliveryGroupUpdateMutation = /* GraphQL */ `
  mutation cartDeliveryGroupUpdate($cartId: ID!, $deliveryGroupId: ID!, $deliveryAddress: DeliveryAddressInput!, $deliveryMethodHandle: String!) {
    cartDeliveryGroupUpdate(cartId: $cartId, deliveryGroupId: $deliveryGroupId, deliveryAddress: $deliveryAddress, deliveryMethodHandle: $deliveryMethodHandle) {
      cart {
        id
        deliveryGroups {
          deliveryAddress {
            ... on MailingAddress {
              address1
              address2
              city
              country
              firstName
              lastName
              phone
            }
          }
          deliveryMethod {
            handle
            title
          }
          id
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartPaymentMethodUpdateMutation = /* GraphQL */ `
  mutation cartPaymentMethodUpdate($cartId: ID!, $paymentMethodId: ID!) {
    cartPaymentMethodUpdate(cartId: $cartId, paymentMethodId: $paymentMethodId) {
      cart {
        id
        paymentMethod {
          id
          name
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartSubmitMutation = /* GraphQL */ `
  mutation cartSubmit($cartId: ID!) {
    cartSubmit(cartId: $cartId) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        attributes {
          key
          value
        }
        buyerIdentity {
          email
          phone
        }
        deliveryGroups {
          deliveryAddress {
            ... on MailingAddress {
              address1
              address2
              city
              country
              firstName
              lastName
              phone
            }
          }
          deliveryMethod {
            handle
            title
          }
          id
        }
        paymentMethod {
          id
          name
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartLineItemsAddMutation = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartSelectedPaymentMethodUpdateMutation = /* GraphQL */ `
  mutation cartSelectedPaymentMethodUpdate($cartId: ID!, $paymentMethodId: ID!) {
    cartSelectedPaymentMethodUpdate(cartId: $cartId, paymentMethodId: $paymentMethodId) {
      cart {
        id
        selectedPaymentMethod {
          id
          name
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartDeliveryOptionUpdateMutation = /* GraphQL */ `
  mutation cartDeliveryOptionUpdate($cartId: ID!, $deliveryOptionHandle: String!) {
    cartDeliveryOptionUpdate(cartId: $cartId, deliveryOptionHandle: $deliveryOptionHandle) {
      cart {
        id
        deliveryOption {
          handle
          title
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const cartPaymentAttemptCreateMutation = /* GraphQL */ `
  mutation cartPaymentAttemptCreate($cartId: ID!) {
    cartPaymentAttemptCreate(cartId: $cartId) {
      attemptToken
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const getCartQuery = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
      buyerIdentity {
        email
        phone
        deliveryAddressPreferences {
          deliveryAddress {
            address1
            city
            country
            firstName
            phone
          }
        }
      }
      attributes {
        key
        value
      }
    }
  }
`;

export const checkoutCreateMutation = /* GraphQL */ `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalPrice {
          amount
          currencyCode
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

export const cartMetafieldsSetMutation = /* GraphQL */ `
  mutation cartMetafieldsSet($cartId: ID!, $metafields: [CartMetafieldsSetInput!]!) {
    cartMetafieldsSet(cartId: $cartId, metafields: $metafields) {
      cart {
        id
        metafields {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const checkoutCompleteFreeWithTokenizedPaymentV3Mutation = /* GraphQL */ `
  mutation checkoutCompleteFreeWithTokenizedPaymentV3($checkoutId: ID!) {
    checkoutCompleteFreeWithTokenizedPaymentV3(checkoutId: $checkoutId) {
      checkout {
        id
        completedAt
        order {
          id
          processedAt
          totalPriceV2 {
            amount
            currencyCode
          }
          shippingAddress {
            address1
            address2
            city
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

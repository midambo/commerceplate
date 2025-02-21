export const createDraftOrderMutation = /* GraphQL */ `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        order {
          id
        }
        subtotalPrice
        totalPrice
        lineItems(first: 100) {
          edges {
            node {
              title
              quantity
              originalUnitPrice
            }
          }
        }
        customer {
          firstName
          phone
        }
        note
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const updateDraftOrderMutation = /* GraphQL */ `
  mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      draftOrder {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

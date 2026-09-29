# Learning Log - Week 4, Day 2

**Date:** 25 September 2026  
**Topics:** ACID properties and multi-document transactions in MongoDB with Mongoose

## Objectives

- Understand Atomicity, Consistency, Isolation, and Durability.
- Learn why transactions are useful when one business operation changes multiple documents.
- Implement a MongoDB transaction with a Mongoose session.
- Separate the transaction workflow into models, repositories, services, controllers, and routes.

## 1. ACID Properties

ACID describes the guarantees expected from a reliable database transaction.

| Property | Meaning | MongoDB example |
| --- | --- | --- |
| **Atomicity** | All operations succeed together, or none are applied. | Decreasing product stock and creating an order are committed together. |
| **Consistency** | The database moves from one valid state to another valid state. | Mongoose validation, schema constraints, and application rules prevent invalid data. |
| **Isolation** | A transaction's uncommitted changes are not treated as committed data by other operations. | The transaction works with a consistent view while its changes remain uncommitted. |
| **Durability** | Committed data survives normal failures. | MongoDB's WiredTiger storage engine and journaling preserve committed changes. |

MongoDB provides important database guarantees, but application code still has to enforce business rules. For example, the application must prevent an order from reducing stock below zero.

## 2. Why Transactions Are Needed

Creating an order involves more than one database change:

1. Read the product and verify that it exists.
2. Check that enough stock is available.
3. Decrease the product stock.
4. Create the order document.

Without a transaction, a failure after step 3 could leave the stock reduced without a corresponding order. A transaction makes the complete workflow an all-or-nothing operation.

```text
Start transaction
       |
Read product and check stock
       |
Decrease stock and create order
       |
Success?
     /     \
   Yes      No
   |         |
 Commit    Abort and rollback
```

## 3. Mongoose Transaction Lifecycle

In Mongoose, the transaction is associated with a MongoDB session. The session identifies which database operations belong to the same transaction.

```js
const session = await mongoose.startSession();

try {
    session.startTransaction();

    // Perform all related database operations with this session.
    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
    throw error;
} finally {
    await session.endSession();
}
```

| Method | Purpose |
| --- | --- |
| `mongoose.startSession()` | Creates a session. |
| `session.startTransaction()` | Begins the transaction. |
| `session.commitTransaction()` | Permanently applies the changes. |
| `session.abortTransaction()` | Cancels the transaction and rolls back its changes. |
| `session.endSession()` | Releases the session. |

The session must be passed to every read and write that should participate in the transaction. Starting a transaction alone does not automatically include operations that use a different session or no session.

## 4. Transaction Practice: Order Creation

The practice application models products and orders. The `createOrder` service coordinates the complete transaction:

```js
const session = await mongoose.startSession();

try {
    session.startTransaction();

    const product = await productRepository.findById(productId, session);
    if (!product) {
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        throw new Error('Insufficient stock');
    }

    const stockUpdate = await productRepository.decreaseStock(
        productId,
        quantity,
        session
    );

    if (stockUpdate.modifiedCount === 0) {
        throw new Error('Failed to update stock');
    }

    const order = await orderRepository.create({
        product: product._id,
        quantity,
        totalAmount: product.price * quantity,
        status: 'Completed',
    }, session);

    await session.commitTransaction();
    return order;
} catch (error) {
    await session.abortTransaction();
    throw error;
} finally {
    await session.endSession();
}
```

The repository methods receive the session explicitly:

```js
const findById = async (productId, session) => {
    return Product.findById(productId).session(session);
};

const decreaseStock = async (productId, quantity, session) => {
    return Product.updateOne(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { session }
    );
};
```

The `$gte` condition and `$inc` update make the stock operation safer under concurrent requests: the update only succeeds when enough stock is still available, and the decrement is performed by MongoDB as one update operation.

## 5. Application Structure

The project separates responsibilities into layers:

- **Models:** Define the `Product` and `Order` schemas, including required fields, minimum values, and the order status enum.
- **Repositories:** Encapsulate database reads and writes and receive the transaction session.
- **Service:** Owns the business workflow and transaction lifecycle.
- **Controller:** Validates the request body and converts service results or errors into HTTP responses.
- **Route:** Exposes order creation through `POST /api/orders`.
- **Database configuration:** Connects Mongoose using `MONGO_URI` from the environment.

This structure keeps transaction coordination in the service instead of spreading `commit` and `abort` logic across route handlers.

## 6. Error and Rollback Scenarios

The transaction is aborted when:

- The product does not exist.
- The requested quantity is greater than available stock.
- The stock update does not modify a document.
- Order creation or transaction commit fails.

When an error is thrown, `abortTransaction()` rolls back the stock update and any other writes made in the transaction. The error is then re-thrown so the controller can return an error response.

## Key Takeaways

1. A transaction is useful when one business operation changes multiple documents.
2. A Mongoose session provides the context that groups operations into one transaction.
3. Every participating repository operation must use the same session.
4. `commitTransaction()` makes the changes permanent, while `abortTransaction()` rolls them back.
5. Schema validation supports consistency, but application code must enforce business rules.
6. Conditional updates such as `{ stock: { $gte: quantity } }` help protect inventory from invalid decrements.
7. Keeping transaction coordination in the service layer makes the workflow easier to test and maintain.

## Practice Verification

- [x] Read and document the four ACID properties.
- [x] Create a product schema with a non-negative stock constraint.
- [x] Create an order schema with quantity and status validation.
- [x] Start a Mongoose session and transaction in the order service.
- [x] Pass the same session through product and order repository operations.
- [x] Commit successful stock and order changes together.
- [x] Abort the transaction when validation or persistence fails.
- [ ] Run the seed script against a configured MongoDB instance.
- [ ] Send a `POST /api/orders` request and verify stock and order results.
- [ ] Test rollback by requesting more stock than is available.

## Reflection

The main lesson was that a transaction is a business-level unit of work, not just a database API call. In this example, an order is not complete unless both inventory and order data change successfully. Passing one session through the service and repositories makes that relationship explicit and gives the application a reliable rollback path.

## Follow-up Actions

- Run the transaction example with MongoDB configured through `MONGO_URI`.
- Verify successful order creation and rollback behavior with an HTTP client.
- Commit the learning log and practice code.
- Raise the day's pull request and share the learning-log and PR links in the required Zoho and Microsoft Teams comments.
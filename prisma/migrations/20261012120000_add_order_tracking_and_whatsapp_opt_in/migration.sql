ALTER TABLE "Order"
ADD COLUMN "whatsappUpdatesOptIn" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'New';

CREATE TABLE "OrderStatusEvent" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrderStatusEvent_orderId_createdAt_idx"
ON "OrderStatusEvent"("orderId", "createdAt");

ALTER TABLE "OrderStatusEvent"
ADD CONSTRAINT "OrderStatusEvent_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

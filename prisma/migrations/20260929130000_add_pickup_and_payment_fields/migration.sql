ALTER TABLE "Order"
ADD COLUMN "fulfillmentType" TEXT NOT NULL DEFAULT 'Delivery',
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "paymentStatus" TEXT;

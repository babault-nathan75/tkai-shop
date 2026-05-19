-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- AlterTable
ALTER TABLE "Order"
  ADD COLUMN "publicRef"       TEXT,
  ADD COLUMN "paymentStatus"   "PaymentStatus" NOT NULL DEFAULT 'pending',
  ADD COLUMN "paymentProvider" TEXT,
  ADD COLUMN "paymentRef"      TEXT,
  ADD COLUMN "paymentMethod"   TEXT,
  ADD COLUMN "paidAt"          TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Order_publicRef_key"  ON "Order"("publicRef");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentRef_key" ON "Order"("paymentRef");

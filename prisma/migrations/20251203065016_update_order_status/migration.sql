/*
  Warnings:

  - Changed the type of `status` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ORDERSTATUS" AS ENUM ('pending', 'paid', 'failed', 'cancelled', 'refunded');

-- AlterTable
ALTER TABLE "order" DROP COLUMN "status",
ADD COLUMN     "status" "ORDERSTATUS" NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";

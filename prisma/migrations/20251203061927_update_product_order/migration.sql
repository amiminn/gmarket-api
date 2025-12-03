/*
  Warnings:

  - Added the required column `token` to the `order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'failed', 'cancelled', 'refunded');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "token" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;

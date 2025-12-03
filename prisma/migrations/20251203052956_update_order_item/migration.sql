/*
  Warnings:

  - You are about to drop the column `price` on the `order_item` table. All the data in the column will be lost.
  - Added the required column `harga` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "price",
ADD COLUMN     "harga" INTEGER NOT NULL;

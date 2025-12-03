/*
  Warnings:

  - The values [pending,paid,failed,cancelled,refunded] on the enum `ORDERSTATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ORDERSTATUS_new" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
ALTER TABLE "order" ALTER COLUMN "status" TYPE "ORDERSTATUS_new" USING ("status"::text::"ORDERSTATUS_new");
ALTER TYPE "ORDERSTATUS" RENAME TO "ORDERSTATUS_old";
ALTER TYPE "ORDERSTATUS_new" RENAME TO "ORDERSTATUS";
DROP TYPE "public"."ORDERSTATUS_old";
COMMIT;

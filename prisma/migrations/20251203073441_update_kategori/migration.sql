/*
  Warnings:

  - You are about to drop the column `namaKategori` on the `kategori` table. All the data in the column will be lost.
  - Added the required column `nama` to the `kategori` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kategori" DROP COLUMN "namaKategori",
ADD COLUMN     "nama" TEXT NOT NULL;

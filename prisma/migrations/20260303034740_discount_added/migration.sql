/*
  Warnings:

  - Added the required column `baseAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "appliedOfferCode" TEXT,
ADD COLUMN     "appliedOfferTitle" TEXT,
ADD COLUMN     "baseAmount" INTEGER NOT NULL,
ADD COLUMN     "discountAmount" INTEGER NOT NULL DEFAULT 0;

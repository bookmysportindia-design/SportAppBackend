/*
  Warnings:

  - The values [MORNING,AFTERNOON,EVENING,EARLY] on the enum `Slot` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Slot_new" AS ENUM ('PRE_DAWN', 'SLOT1', 'SLOT2', 'SLOT3', 'DNSLOT', 'MIDNIGHT');
ALTER TABLE "Booking" ALTER COLUMN "slot" TYPE "Slot_new" USING ("slot"::text::"Slot_new");
ALTER TYPE "Slot" RENAME TO "Slot_old";
ALTER TYPE "Slot_new" RENAME TO "Slot";
DROP TYPE "public"."Slot_old";
COMMIT;

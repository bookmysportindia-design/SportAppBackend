-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('PARKING', 'TOILETS', 'CHANGING_ROOMS', 'FIRST_AID', 'WATER_FACILITY');

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "aminitiesEnum" "Amenity"[];

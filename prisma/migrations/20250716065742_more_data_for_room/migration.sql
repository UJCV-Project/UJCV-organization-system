/*
  Warnings:

  - You are about to drop the column `code` on the `Room` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Professor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `building` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipment` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professor"
ADD COLUMN     "status" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "code",
ADD COLUMN     "building" VARCHAR(30) NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "equipment" VARCHAR(255) NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(30) NOT NULL,
ADD COLUMN     "room_type" VARCHAR(30) NOT NULL;

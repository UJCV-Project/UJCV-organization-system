-- CreateEnum
CREATE TYPE "DegreeStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('activo', 'inactivo');

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DegreeStatus" NOT NULL,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "status" "CourseStatus" NOT NULL,
    "degreeId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Degree_code_key" ON "Degree"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

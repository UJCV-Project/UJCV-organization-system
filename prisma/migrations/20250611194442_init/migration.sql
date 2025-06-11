-- CreateEnum
CREATE TYPE "DegreeStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('activo', 'inactivo');

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DegreeStatus" NOT NULL DEFAULT 'activo',

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitValue" INTEGER NOT NULL,
    "theoryHours" INTEGER NOT NULL,
    "practiceHours" INTEGER NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'activo',

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "degreeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semester" INTEGER,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("degreeId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Degree_code_key" ON "Degree"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

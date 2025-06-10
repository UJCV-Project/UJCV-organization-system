-- AlterTable
ALTER TABLE "DegreeProgram" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "Curriculum_status_idx" ON "Curriculum"("status");

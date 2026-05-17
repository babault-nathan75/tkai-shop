-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "imageUrl" TEXT;

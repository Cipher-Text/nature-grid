-- CreateTable
CREATE TABLE "Species" (
    "id" TEXT NOT NULL,
    "gbifKey" INTEGER NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "vernacularName" TEXT,
    "kingdom" TEXT,
    "phylum" TEXT,
    "class" TEXT,
    "order" TEXT,
    "family" TEXT,
    "genus" TEXT,
    "iucnStatus" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "id" TEXT NOT NULL,
    "gbifOccurrenceKey" INTEGER NOT NULL,
    "speciesId" TEXT NOT NULL,
    "districtId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "observedAt" TIMESTAMP(3),
    "recordedBy" TEXT,
    "basisOfRecord" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_gbifKey_key" ON "Species"("gbifKey");

-- CreateIndex
CREATE INDEX "Species_canonicalName_idx" ON "Species"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "Occurrence_gbifOccurrenceKey_key" ON "Occurrence"("gbifOccurrenceKey");

-- CreateIndex
CREATE INDEX "Occurrence_speciesId_idx" ON "Occurrence"("speciesId");

-- CreateIndex
CREATE INDEX "Occurrence_districtId_idx" ON "Occurrence"("districtId");

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

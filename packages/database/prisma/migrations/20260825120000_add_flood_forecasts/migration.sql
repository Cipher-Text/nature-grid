-- CreateTable
CREATE TABLE "FloodForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "riverDischarge" DOUBLE PRECISION,
    "riverDischargeMean" DOUBLE PRECISION,
    "riverDischargeMedian" DOUBLE PRECISION,
    "riverDischargeMax" DOUBLE PRECISION,
    "riverDischargeMin" DOUBLE PRECISION,
    "riverDischargeP25" DOUBLE PRECISION,
    "riverDischargeP75" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FloodForecast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FloodForecast_districtId_forecastDate_key" ON "FloodForecast"("districtId", "forecastDate");
CREATE INDEX "FloodForecast_districtId_idx" ON "FloodForecast"("districtId");
CREATE INDEX "FloodForecast_forecastDate_idx" ON "FloodForecast"("forecastDate");

-- AddForeignKey
ALTER TABLE "FloodForecast" ADD CONSTRAINT "FloodForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

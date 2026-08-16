-- CreateTable
CREATE TABLE "CurrentWeatherReading" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "readingTime" TIMESTAMP(3) NOT NULL,
    "temperature2m" DOUBLE PRECISION,
    "relativeHumidity2m" INTEGER,
    "apparentTemperature" DOUBLE PRECISION,
    "windSpeed10m" DOUBLE PRECISION,
    "windDirection10m" INTEGER,
    "precipitation" DOUBLE PRECISION,
    "weatherCode" INTEGER,
    "cloudCover" INTEGER,
    "isDay" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentWeatherReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyWeatherForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastTime" TIMESTAMP(3) NOT NULL,
    "temperature2m" DOUBLE PRECISION,
    "relativeHumidity2m" INTEGER,
    "apparentTemperature" DOUBLE PRECISION,
    "precipitationProbability" INTEGER,
    "precipitation" DOUBLE PRECISION,
    "weatherCode" INTEGER,
    "windSpeed10m" DOUBLE PRECISION,
    "windDirection10m" INTEGER,
    "cloudCover" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HourlyWeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyWeatherForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastDate" DATE NOT NULL,
    "weatherCode" INTEGER,
    "temperature2mMax" DOUBLE PRECISION,
    "temperature2mMin" DOUBLE PRECISION,
    "apparentTemperatureMax" DOUBLE PRECISION,
    "apparentTemperatureMin" DOUBLE PRECISION,
    "precipitationSum" DOUBLE PRECISION,
    "precipitationProbabilityMax" INTEGER,
    "windSpeed10mMax" DOUBLE PRECISION,
    "uvIndexMax" DOUBLE PRECISION,
    "sunrise" TIMESTAMP(3),
    "sunset" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyAirQuality" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastTime" TIMESTAMP(3) NOT NULL,
    "pm10" DOUBLE PRECISION,
    "pm25" DOUBLE PRECISION,
    "carbonMonoxide" DOUBLE PRECISION,
    "nitrogenDioxide" DOUBLE PRECISION,
    "sulphurDioxide" DOUBLE PRECISION,
    "ozone" DOUBLE PRECISION,
    "uvIndex" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HourlyAirQuality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurrentWeatherReading_districtId_idx" ON "CurrentWeatherReading"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentWeatherReading_districtId_readingTime_key" ON "CurrentWeatherReading"("districtId", "readingTime");

-- CreateIndex
CREATE INDEX "HourlyWeatherForecast_districtId_idx" ON "HourlyWeatherForecast"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "HourlyWeatherForecast_districtId_forecastTime_key" ON "HourlyWeatherForecast"("districtId", "forecastTime");

-- CreateIndex
CREATE INDEX "DailyWeatherForecast_districtId_idx" ON "DailyWeatherForecast"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyWeatherForecast_districtId_forecastDate_key" ON "DailyWeatherForecast"("districtId", "forecastDate");

-- CreateIndex
CREATE INDEX "HourlyAirQuality_districtId_idx" ON "HourlyAirQuality"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "HourlyAirQuality_districtId_forecastTime_key" ON "HourlyAirQuality"("districtId", "forecastTime");

-- AddForeignKey
ALTER TABLE "CurrentWeatherReading" ADD CONSTRAINT "CurrentWeatherReading_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyWeatherForecast" ADD CONSTRAINT "HourlyWeatherForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWeatherForecast" ADD CONSTRAINT "DailyWeatherForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyAirQuality" ADD CONSTRAINT "HourlyAirQuality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "WeatherQuery" DROP CONSTRAINT "WeatherQuery_userId_fkey";

-- AddForeignKey
ALTER TABLE "WeatherQuery" ADD CONSTRAINT "WeatherQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

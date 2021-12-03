library(arcos)

library(dplyr)

library(tidyverse)

library(readr)

library(lubridate)

library(ggplot2)

# store yearly population 2006-2014
statepopulations <- state_population(state="KY", key="WaPo")


# store all data by county and year
counties <- full_join(select(county_population(state="KY", key="WaPo"), BUYER_COUNTY, year, population, countyfips), select(summarized_county_annual(state="KY", key="WaPo"), BUYER_COUNTY, year, count, DOSAGE_UNIT, countyfips))


# store latlon of each pharmacy by DEA ID and county (only includes retail and chain pharmacy designations)

pharmlatlon <- pharm_latlon(state="KY", key="WaPo")

# store pharmacy latlon info with fips codes
pharmacies <- select(full_join(pharmlatlon, pharm_counties(state="KY", key="WaPo")), BUYER_DEA_NO, BUYER_COUNTY, lat, lon, COUNTYFP, county_fips)

# remove pharmlatlon to keep variables clean and minimal
rm(pharmlatlon)

# store list of drugs available in database
druglist <- drug_list(key="WaPo")

# re-declare pharmacies variable to include buyer name, address, and type

pharmacies <- select(full_join(buyer_addresses(state="KY", key="WaPo"), pharmacies), BUYER_DEA_NO, BUYER_BUS_ACT, BUYER_NAME, BUYER_ADDRESS1, BUYER_ADDRESS2, BUYER_CITY, BUYER_STATE, BUYER_ZIP, lat, lon, COUNTYFP, county_fips)

# extract hospitals, clinics, and practitioners to their own dataframe
medicalfacilities <- filter(pharmacies, BUYER_BUS_ACT %in% c("PRACTITIONER", "PRACTITIONER-DW/100", "PRACTITIONER-DW/100", "PRACTITIONER-DW-275", "HOSP/CLINIC-VA", "HOSPITAL/CLINIC", "MLP-NURSE PRACTITIONER", "MLP-OPTOMETRIST", "HOSP/CLINIC - MIL", "HOSP/CLINIC FED", "MLP-NURSE PRACTITIONER-DW/30"))

# extract manufacturers and distributors to their own dataframe
manudist <- filter(pharmacies, BUYER_BUS_ACT %in% c("MANUFACTURER", "DISTRIBUTOR"))
manudist <- select(manudist, BUYER_DEA_NO, BUYER_BUS_ACT, BUYER_NAME, BUYER_CITY)

# narrow pharmacies to retail and chain pharmacies
pharmacies <- filter(pharmacies, BUYER_BUS_ACT %in% c("RETAIL PHARMACY", "CHAIN PHARMACY"))

#### The server on the API isn't pulling pill counts. I used raw data instead from here on.
# I don't want to run these again, so they are commented out: 
 kentuckyall <- read_csv("arcos-ky-statewide-itemized.csv")
 medicalfacilities2 <- filter(kentuckyall, BUYER_BUS_ACT %in% c("PRACTITIONER", "PRACTITIONER-DW/100", "PRACTITIONER-DW/100", "PRACTITIONER-DW-275", "HOSP/CLINIC-VA", "HOSPITAL/CLINIC", "MLP-NURSE PRACTITIONER", "MLP-OPTOMETRIST", "HOSP/CLINIC - MIL", "HOSP/CLINIC FED", "MLP-NURSE PRACTITIONER-DW/30"))
 pharmacies2 <- filter(kentuckyall, BUYER_BUS_ACT %in% c("RETAIL PHARMACY", "CHAIN PHARMACY"))
 rm(kentuckyall)


# parse the dates
pharmacies2$TRANSACTION_DATE <- mdy(pharmacies2$TRANSACTION_DATE)
medicalfacilities2$TRANSACTION_DATE <- mdy(medicalfacilities2$TRANSACTION_DATE)
# create year variable
pharmacies2$year <- year(pharmacies2$TRANSACTION_DATE)
medicalfacilities2$year <- year(medicalfacilities2$TRANSACTION_DATE)
# remove TRANSACTION_DATE since we no longer need it
pharmacies2$TRANSACTION_DATE <- NULL
medicalfacilities2$TRANSACTION_DATE <- NULL


# group by total dosages per year per facility
pharmacies2 <- pharmacies2 %>% group_by(BUYER_DEA_NO, year, BUYER_NAME, BUYER_COUNTY, BUYER_ADDRESS1, BUYER_ADDRESS2, BUYER_CITY, BUYER_ZIP, BUYER_BUS_ACT) %>% summarize(pill_count = sum(DOSAGE_UNIT, na.rm=T))
medicalfacilities2 <- medicalfacilities2 %>% group_by(BUYER_DEA_NO, year, BUYER_NAME, BUYER_COUNTY, BUYER_ADDRESS1, BUYER_ADDRESS2, BUYER_CITY, BUYER_ZIP, BUYER_BUS_ACT) %>% summarize(pill_count = sum(DOSAGE_UNIT, na.rm=T))

# we don't need medicalfacilities anymore because it doesn't have lat/long
rm(medicalfacilities)

# join latlon data and move all to one variable, pharmacies
pharmacies <- full_join(pharmacies2, pharmacies)
pharmacies$BUYER_STATE <- NULL
rm(pharmacies2)

# rename medicalfacilities2
medicalfacilities <- medicalfacilities2
rm(medicalfacilities2)

# create new data frame for county totals by year
countytotalbyyear <- pharmacies %>% group_by(BUYER_COUNTY, year) %>% summarize(countypillcount = sum(pill_count, na.rm=T))

# create new data frame for county totals total 2006-2014
countytotals <- countytotalbyyear %>% group_by(BUYER_COUNTY) %>% summarize(countypillcount = sum(countypillcount, na.rm=T))

# now we need county populations so we can normalize the data
countypops <- county_population(state="KY", key="WaPo")
countytotalbyyear <-  full_join(countytotalbyyear, countypops)
countytotalbyyear$BUYER_STATE <- NULL
countytotalbyyear$STATE <- NULL
countytotalbyyear$NAME <- NULL
countytotalbyyear$variable <- NULL
countytotalbyyear$county_name <- NULL

# add pills per person
countytotalbyyear$pillsperperson <- countytotalbyyear$countypillcount/countytotalbyyear$population

# we no longer need countypops
rm(countypops)

# view what percent each pharmacy supplied each county
totalbypharmacy <- pharmacies %>% group_by(BUYER_DEA_NO, BUYER_NAME, BUYER_COUNTY) %>% summarize(totalpill = sum(pill_count, na.rm=T))
totalbypharmacy <- filter(totalbypharmacy, totalpill > 0)
totalbypharmacy <- (full_join(totalbypharmacy, countytotals))
totalbypharmacy <- mutate(totalbypharmacy, percentcountytotal = totalpill/countypillcount)
totalbypharmacy <- mutate(totalbypharmacy, percentcountytotal = percentcountytotal * 100)

# find kentucky total pill count
sum(totalbypharmacy$countypillcount, na.rm=T)
# returns 119480457751

# find percentage of total state pills for each pharmacy
totalbypharmacy <- mutate(totalbypharmacy, percentstatetotal = totalpill / 119480457751)
totalbypharmacy <- mutate(totalbypharmacy, percentstatetotal = percentstatetotal * 100)



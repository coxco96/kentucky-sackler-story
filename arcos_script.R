library(arcos)

library(dplyr)

# store yearly population 2006-2014
statepopulations <- state_population(state="KY", key="WaPo")


# store all data by county and year
counties <- full_join(select(county_population(state="KY", key="WaPo"), BUYER_COUNTY, year, population, countyfips), select(summarized_county_annual(state="KY", key="WaPo"), BUYER_COUNTY, year, count, DOSAGE_UNIT, countyfips))


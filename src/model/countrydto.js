class CountryDTO {
    constructor({
        id,
        countryName,
        cityName,
        economicSituation,
    }) {
        this.id = id;       
        this.countryName = countryName;                // Name of the country
        this.cityName = cityName;                      // Name of the city
        this.economicSituation = economicSituation;    // Description of the economic situation
    }
}

module.exports = CountryDTO;

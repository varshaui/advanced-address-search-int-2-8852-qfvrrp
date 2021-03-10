import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_KEY } from "./app.constants";

@Injectable()
export class AppService {
  private baseURL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
  private headers = { "x-rapidapi-key": API_KEY };

  constructor(private httpClient: HttpClient) {}

  getCountries(endpath) {
    return this.httpClient.get(this.baseURL + endpath, {
      headers: this.headers
    });
  }

  getStates(countryCode: string) {
    const urlPath = `/countries/${countryCode}/regions`;
    return this.httpClient.get(this.baseURL + urlPath, {
      headers: this.headers
    });
  }

  getCities(stateCode: string, countryCode: string) {
    const urlPath = `/countries/${countryCode}/regions/${stateCode}/cities`;
    return this.httpClient.get(this.baseURL + urlPath, {
      headers: this.headers
    });
  }

  getCityDistance(city1: string, city2: string) {
    return this.httpClient.get(
      `${this.baseURL}/cities/${city1}/distance?fromCityId=${city2}`,
      {
        headers: this.headers
      }
    );
  }

  getCityTime(city: string) {
    return this.httpClient.get(`${this.baseURL}/cities/${city}/time`, {
      headers: this.headers
    });
  }

  getCityDetails(city: string) {
    return this.httpClient.get(`${this.baseURL}/cities/${city}`, {
      headers: this.headers
    });
  }
}

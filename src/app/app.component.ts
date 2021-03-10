import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { AppService } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Near City Search";
  countryList = [];
  stateList1 = [];
  cityList1 = [];

  stateList2 = [];
  cityList2 = [];

  addressForm1: FormGroup;
  addressForm2: FormGroup;

  city1Details = null;
  city2Details = null;

  distance = null;

  constructor(private apiService: AppService, private fb: FormBuilder) {
    this.getCountriesList("/countries");
    // this.getStates("/state", id);
  }

  ngOnInit() {
    const addressForm = {
      country: ["", [Validators.required]],
      state: ["", Validators.required],
      city: ["", Validators.required]
    };
    this.addressForm1 = this.fb.group(addressForm);
    this.addressForm2 = this.fb.group(addressForm);

    this.addressOneFormChangeEvents();
    this.addressTwoFormChangeEvents();
  }

  addressOneFormChangeEvents() {
    const countryControl = this.addressForm1.get("country");
    countryControl.valueChanges.subscribe(value => {
      if (value) {
        this.getStates(value, 1);
        this.addressForm1.patchValue({
          state: "",
          city: ""
        });
      }
    });

    const stateControl = this.addressForm1.get("state");
    stateControl.valueChanges.subscribe(value => {
      if (value) {
        this.getCities(value, this.addressForm1.get("country").value, 1);
        this.addressForm1.patchValue({
          city: ""
        });
      }
    });
  }

  addressTwoFormChangeEvents() {
    const countryControl = this.addressForm2.get("country");
    countryControl.valueChanges.subscribe(value => {
      if (value) {
        this.getStates(value, 2);
        this.addressForm2.patchValue({
          state: "",
          city: ""
        });
      }
    });

    const stateControl = this.addressForm2.get("state");
    stateControl.valueChanges.subscribe(value => {
      if (value) {
        this.getCities(value, this.addressForm2.get("country").value, 2);
        this.addressForm2.patchValue({
          city: ""
        });
      }
    });
  }

  getCountriesList(endpath) {
    this.apiService.getCountries(endpath).subscribe(res => {
      this.countryList = res["data"].map(res => {
        return {
          label: res.name,
          value: res.code
        };
      });
    });
  }

  getCityDetails(response, timeResponse) {
    const { data } = response;
    return {
      city: data.name,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      time: timeResponse.data
    };
  }

  compareCities() {
    this.city2Details = null;
    this.city1Details = null;
    this.distance = null;
    const city1 = this.addressForm1.get("city").value;
    const city2 = this.addressForm2.get("city").value;

    if (city1 && city2) {
      setTimeout(() => {
        this.apiService.getCityDetails(city1).subscribe(res => {
          setTimeout(() => {
            this.apiService.getCityTime(city1).subscribe(timeResponse => {
              this.city1Details = this.getCityDetails(res, timeResponse);
            });
          }, 5000);
        });
      }, 5000);
      setTimeout(() => {
        this.apiService.getCityDetails(city2).subscribe(res => {
          setTimeout(() => {
            this.apiService.getCityTime(city1).subscribe(timeResponse => {
              this.city2Details = this.getCityDetails(res, timeResponse);
            });
          }, 5000);
        });
      }, 5000);
      this.apiService.getCityDistance(city1, city2).subscribe((res: any) => {
        this.distance = res.data;
      });
    }
  }
  getStates(countryCode: string, index: number) {
    this.apiService.getStates(countryCode).subscribe(res => {
      this[`stateList${index}`] = res["data"].map(res => {
        return {
          label: res.name,
          value: res.isoCode
        };
      });
      this[`cityList${index}`] = [];
    });
  }

  getCities(stateCode: string, countryCode: string, index: number) {
    this.apiService.getCities(stateCode, countryCode).subscribe(res => {
      this[`cityList${index}`] = res["data"].map(res => {
        return {
          label: res.name,
          value: res.wikiDataId
        };
      });
    });
  }
}

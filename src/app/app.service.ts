import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class AppService {

    private covalentUrl = 'https://api.covalenthq.com/v1/250/address/';
    private covalentKey = 'ckey_999c6c5421f24cd08f32bf5bfb0';
    private depositManager = '0x7401833bc5221B631EDA13459391A8b511122db8';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        }),
        params: new HttpParams
    };

    constructor( private http: HttpClient ) {}

    getTransactions() {
      let url = this.covalentUrl + this.depositManager + '/transactions_v2/?&key=' + this.covalentKey;
      const promise = this.http.get(url, this.httpOptions).toPromise();
      return promise;
    }
}

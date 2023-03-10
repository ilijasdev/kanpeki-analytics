import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ContractsService {

    private ftmScanUrl = 'https://api.ftmscan.com/api';
    private borrowContract = '?module=account&action=txlist&address=0x80804723B580CF841af9DA879b41211488D95989&startblock=0&endblock=99999999&sort=asc';
    private ftmScanApiKey = '&apikey=YourApiKeyToken';
    private coinGeckoApi = 'https://api.coingecko.com/api/v3/simple/token_price/fantom?contract_addresses=0x04068DA6C83AFCFA0e13ba15A6696662335D5B75%2C0x049d68029688eAbF473097a2fC38ef61633A3C7A%2C0x74b23882a30290451A17c44f4F05243b6b58C76d%2C0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83%2C0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E%2C0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8%2C0x321162Cd933E2Be498Cd2267a90534A804051b11&vs_currencies=usd';

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

    getAllBorrowContractTx() {
      let url = this.ftmScanUrl + this.borrowContract + this.ftmScanApiKey;

      const promise = this.http.get(url, this.httpOptions).toPromise();
      return promise;
    }

    getAllWhitelistedPrices() {
      const promise = this.http.get(this.coinGeckoApi).toPromise();
      return promise;
    }

    getAllDepositTx() {
      let url = this.covalentUrl + this.depositManager + '/transactions_v2/?block-signed-at-asc=false&page-number=&page-size=10000&key=' + this.covalentKey;
      const promise = this.http.get(url, this.httpOptions).toPromise();
      return promise;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Bitcoin } from '../models/bitcoin';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root',
})
export class BitcoinService {
  private apiUrl = 'https://localhost:44329/api/Bitcoins/';

  constructor(private httpClient: HttpClient) {}

  getAllBitcoinData(): Observable<ListResponseModel<Bitcoin>> {
    return this.httpClient.get<ListResponseModel<Bitcoin>>(this.apiUrl+"getall")
  }
}
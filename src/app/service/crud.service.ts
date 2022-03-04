import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private  baseUrl= environment.apiURL+'/api/v1/account';
   public static  httpHeader={
    headers:new HttpHeaders({
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'GET,POST',
      'Content-Type': 'application/json'

    })
  }
  constructor(private http:HttpClient) { }

  get(url:string): Observable<any>{
    return this.http.get(this.baseUrl+url,CrudService.httpHeader);
  }
  post(url:string,data: any){
    return this.http.post(this.baseUrl+url,data,CrudService.httpHeader)
  }
}

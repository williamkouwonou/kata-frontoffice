import { Component, inject, Inject } from '@angular/core';
import { compte } from './modeles/compte';
import { CrudService } from './service/crud.service';
import {MatDialog,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { operation } from './modeles/operation';
import {MatPaginator} from '@angular/material/paginator';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kata-frontoffice';
  displayedColumns: string[] = ['accountNumber', 'clientName', 'balance','action'];
  dataSource = [];
  listAccounts: compte[] = [];
  constructor(private webservice: CrudService,public dialog: MatDialog) {
    this.getAllAccount();
  }
  getAllAccount() {
    this.webservice.get('/findAll').subscribe(
      (data) => {
        
       this.listAccounts=data;
       console.log(this.listAccounts)
      },
      (error) => {
        console.error(error);
      }

    )
  }
 
  openDetail(cmpt: compte) {
    console.log(cmpt);
    
    const dialogRef = this.dialog.open(DialogOperations,{
      data:cmpt.id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dialog-operations',
  templateUrl: 'dialog-operations.html',
  styleUrls: ['./app.component.scss']
})
export class DialogOperations implements AfterViewInit{
   listOperations: operation[] = [];
  displayedColumns: string[] = ['date', 'transactionType', 'amount','balance'];
  dataSource = new MatTableDataSource<operation>(this.listOperations);
  accountId:string='';
  amount:number=0;
  constructor(@Inject(MAT_DIALOG_DATA) public data:string,private webservice: CrudService){
   this.accountId=data;
    this.getOperations(data);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getOperations(idAccount:string) {
    this.webservice.get('/operations/'+idAccount).subscribe(
      (data) => {
        
       this.listOperations=data;
       this.dataSource = new MatTableDataSource<operation>(this.listOperations);
       this.dataSource.paginator = this.paginator;
       this.amount=0;
      
      },
      (error) => {
        console.error(error);
      }

    )
  }
  toDeposit() {
    this.webservice.post('/deposit/'+this.accountId,{'amount':this.amount}).subscribe(
      (data) => {
        this.getOperations(this.accountId);
       alert("Successful operation")
       this.amount=0;
      },
      (error) => {
        if(error.status==400){
          alert(error.error.message+":    "+error.error.reasonCodes[0].message)

        }
      }

    )
  }
  toWithdrawal() {
    this.webservice.post('/withdrawal/'+this.accountId,{'amount':this.amount}).subscribe(
      (data) => {
        this.getOperations(this.accountId);
       alert("Successful operation")
      },
      (error) => {

        if(error.status==400){
          alert(error.error.message+":    "+error.error.reasonCodes[0].message)

        }
        
      }

    )
  }
}
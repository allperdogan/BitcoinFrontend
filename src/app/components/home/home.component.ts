import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDetail } from 'src/app/models/userDetail';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuthorizated = false;
  isAnAdmin = false;
  userDetails: UserDetail;

  constructor(private localService: LocalService,
    private router: Router,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.checkIsAuthorizated()
    this.getUserDetails()
    this.isAdmin()
  }


  getUserDetails() {
    this.userDetails = JSON.parse(this.localService.getItem("user_details") || '')
  }

  checkIsAuthorizated() {
    if (this.localService.getItem("token")) {
      this.isAuthorizated = true
    } else {
      this.isAuthorizated = false
    }
  }

  logOut() {
    this.localService.delete("token")
    this.localService.delete("user_details")
    this.localService.delete("user_claim")
    this.toastrService.info("Çıkış yapıldı.", "Bilgilendirme!")
    window.location.reload()
  }

  isAdmin(){
    if (this.localService.getItem("user_claim")) {
      this.isAnAdmin = true
    }
    else{
      this.isAnAdmin = false
    }
  }
}
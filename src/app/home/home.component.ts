import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '@app/core/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService
      .getUsersList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}

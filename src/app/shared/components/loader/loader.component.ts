import { Component, OnInit } from '@angular/core';
import { LoaderService } from './../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean;
  loadingMessage: string;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.isLoading$.subscribe(
      loading => (this.isLoading = loading)
    );
    this.loaderService.message$.subscribe(
      message => (this.loadingMessage = message)
    );
  }
}

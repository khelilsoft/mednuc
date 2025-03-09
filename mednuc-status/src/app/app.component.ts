import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusService, ArticleStatus } from './status.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  status$: Observable<ArticleStatus | null>;

  constructor(private statusService: StatusService) {
    this.status$ = this.statusService.status$;
  }

  ngOnInit() {
    // Rafraîchir le statut toutes les 5 minutes
    setInterval(() => {
      this.refreshStatus();
    }, 5 * 60 * 1000);
  }

  refreshStatus() {
    this.statusService.loadStatus();
  }
}

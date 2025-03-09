import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';

export interface ArticleStatus {
  manuscriptNumber: string;
  title: string;
  status: string;
  lastCheck: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private statusSubject = new BehaviorSubject<ArticleStatus | null>(null);
  public status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStatus();
  }

  public loadStatus() {
    console.log('Chargement du statut...');
    this.http.get<ArticleStatus>('./assets/status.json')
      .pipe(
        tap(status => console.log('Statut chargé:', status)),
        catchError(error => {
          console.error('Erreur lors du chargement du statut:', error);
          return [];
        })
      )
      .subscribe(status => {
        if (status) {
          this.statusSubject.next(status);
        }
      });
  }
} 
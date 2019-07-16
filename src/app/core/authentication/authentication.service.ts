import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError, timeout, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

export interface Credentials {
  // Customize received credentials here
  email: string;
  token: string;
}

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = environment.credentialsKey;

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;

  constructor(private httpClient: HttpClient, private router: Router) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    // Replace by proper authentication call
    return this.httpClient
      .cache()
      .post('/auth/login', context)
      .pipe(
        map((body: any) => {
          console.log(body.data);
          this.setCredentials(body.data, context.remember);
          return of(body.data);
        }),
        catchError(err => throwError(err))
      );
  }

  getUsersList(): Observable<any> {
    // Replace by proper authentication call
    return this.httpClient
      .cache()
      .get('/users')
      .pipe(
        map((body: any) => {
          return body.data;
        }),
        catchError(err => throwError(err))
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}

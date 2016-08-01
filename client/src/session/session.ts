import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";

export class SessionAccount {
    id: number;
    donationTier: number;
    name: string;
    token: string;
    expiresAt: Date;
    version: number;

    constructor(data: any) {
        this.id = data.id;
        this.donationTier = data.donationTier;
        this.name = data.name;
        this.token = data.token;
        this.expiresAt = new Date(data.expiresAt as any);
        this.version = data.version;
    }
}

const STORAGE_KEY = 'session';
const SESSION_VERSION = 1;

@Injectable()
export class Session {
    account: SessionAccount = null;
    expiresTimeout;

    constructor(private http: Http) { }

    isAuthenticated(): boolean {
        this.initAccount();
        return this.account != null;
    }

    hasEarlyAccess(): boolean {
        return this.isAuthenticated() && this.account.donationTier >= 2;
    }

    setAccountName(name: string) {
        let res = localStorage.getItem(STORAGE_KEY);
        if (res) {
            this.account = new SessionAccount(JSON.parse(res));
            this.account.name = name;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.account));
        }
    }

    setDonationTier(tier: number) {
        let res = localStorage.getItem(STORAGE_KEY);
        if (res) {
            this.account = new SessionAccount(JSON.parse(res));
            this.account.donationTier = tier;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.account));
        }
    }

    login(code: string) {
        return Observable.create(observer => {
            this.http
                .get(GUARDIAN_API + '/oauth/login')
                .map(res => res.json().data)
                .subscribe((res: any) => {
                    res.version = SESSION_VERSION;

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
                    this.initAccount();

                    console.debug(this.account as any);

                    let expiresAt: string = new Date(this.account.expiresAt.toString()).toUTCString();
                    document.cookie = 'authenticated=1; expires=' + expiresAt;

                    observer.next(true);
                    observer.complete();
                }, () => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }

    logout() {
        localStorage.removeItem('session');
        document.cookie = 'authenticated=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        this.account = null;
        this.expiresTimeout = null;
    }

    private initAccount() {
        if (this.account) {
            return;
        }
        let res = localStorage.getItem(STORAGE_KEY);
        if (res) {
            this.account = new SessionAccount(JSON.parse(res));

            if (this.account.version !== SESSION_VERSION) {
                this.account = null;
                localStorage.removeItem('session');
                return;
            }
        }
    }
}

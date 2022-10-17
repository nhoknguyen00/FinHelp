import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ComponentModule } from './component/component.module';
import { AppInitFactory, HttpLoaderFactory } from './includes/translation.config';
import { AuthModule } from './pages/auth/auth.module';
import { AppCommonModule } from './pages/common/common.module';
import { reducers } from './store/app.states';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], {
            onSameUrlNavigation: 'reload',
            anchorScrolling: 'enabled',
        }),
        NgbModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        AuthModule,
        ComponentModule,
        AppCommonModule,
        StoreModule.forRoot(reducers, {}),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.mode === 'PROD' }),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitFactory,
            deps: [TranslateService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

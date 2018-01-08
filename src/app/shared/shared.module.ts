import { AddSshKeyModalComponent } from 'app/shared/components/add-ssh-key-modal/add-ssh-key-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomFormsModule } from 'ng2-validation';
import { ClipboardModule } from 'ngx-clipboard';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatSliderModule,
    // OverlayModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatExpansionModule,
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import 'hammerjs';
import { NgReduxFormModule } from '@angular-redux/form';


const modules: Array<any> = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    SlimLoadingBarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatSliderModule,
    // OverlayModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatExpansionModule,
    ClipboardModule,
    NgReduxFormModule
];

@NgModule({
    imports: [
        ...modules
    ],
    declarations: [
        AddSshKeyModalComponent
    ],
    exports: [
        ...modules,
        AddSshKeyModalComponent
    ],
    providers: [
        {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
    ],
    entryComponents: [AddSshKeyModalComponent]
})

export class SharedModule { }

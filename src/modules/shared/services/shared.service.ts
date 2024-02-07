import { Injectable, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    errToasterMsg;
    @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
    constructor(private toaster: ToastrService) {
        this.toaster.overlayContainer = this.toastContainer;
    }
    showSuccess(successMsg) {
        this.toaster.success(successMsg);
    }
    showErrors(errorMsg) {
        this.errToasterMsg = this.toaster.error(errorMsg, '', {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: true
        })
    }
}


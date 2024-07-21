import { Injectable } from '@angular/core';
import { NotificationSettings } from '@progress/kendo-angular-notification';
import { NotificationService } from "@progress/kendo-angular-notification";
@Injectable({
  providedIn: 'root'
})
export class NotiService {

  constructor(private notificationService: NotificationService) { }

  Show(content: string, status: string){
    switch(status){
      case "success":
        this.notificationService.show({
          content: content,
          hideAfter: 3000,
          position: { horizontal: "left", vertical: "bottom" },
          animation: { type: "fade", duration: 400 },
          type: { style: "success", icon: true },
        });
        break
      case "warning":
        this.notificationService.show({
          content: content,
          hideAfter: 3000,
          position: { horizontal: "left", vertical: "bottom" },
          animation: { type: "fade", duration: 400 },
          type: { style: "warning", icon: true },
        });
        break
      case "error":
        this.notificationService.show({
          content: content,
          hideAfter: 3000,
          position: { horizontal: "left", vertical: "bottom" },
          animation: { type: "fade", duration: 400 },
          type: { style: "error", icon: true },
        });
        break
    }
  }
}

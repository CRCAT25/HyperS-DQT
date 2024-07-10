import { NotiService } from './../../../../ecom-pages/shared/service/noti.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadImageService } from '../../service/uploadImage.service';
import { DTOImageProduct } from 'src/app/ecom-pages/shared/dto/DTOImageProduct';
import { FileRestrictions } from '@progress/kendo-angular-upload';

@Component({
  selector: 'component-import-multi-image',
  templateUrl: './import-multi-image.component.html',
  styleUrls: ['./import-multi-image.component.scss']
})
export class ImportMultiImageComponent implements OnInit {
  selectedFile: File | null = null;
  maxQuantity: number = 10;
  listImageHandler: DTOImageProduct[];
  @Input() listImage: DTOImageProduct[];
  @Output() getListImageSelected: EventEmitter<any> = new EventEmitter<any>();

  fileRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png"],
  };

  constructor(private uploadImageService: UploadImageService, private notiService: NotiService) { }

  ngOnInit(): void {
    this.listImageHandler = this.listImage;
  }

  // Chọn file ảnh
  onFileSelected(event: any) {
    if (event) {
      this.selectedFile = event.files[0].rawFile;
    }
    this.onUpload();
    this.getListImageOutput();
  }

  // Upload hình ảnh lên imgBB
  onUpload() {
    if (this.selectedFile) {
      this.uploadImageService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          const isThumbnail = this.listImageHandler.length === 0;
          this.listImageHandler.push({
            "Code": 0,
            "IdImage": null,
            "ImgUrl": response.data.url,
            "IsThumbnail": isThumbnail
          });
        },
        (error) => {
          this.notiService.Show('Xảy ra lỗi trong quá trình upload ảnh', 'error');
          window.location.reload();
          // console.error('Error uploading image:', error);
        }
      );
    }
  }

  // Xóa ảnh trong list
  deleteImageFromList(image: DTOImageProduct) {
    this.listImageHandler = this.listImageHandler.filter(img => img !== image);
    if (image.IsThumbnail && this.listImageHandler.length > 0) {
      this.listImageHandler[0].IsThumbnail = true;
    }
  }

  clearListImage() {
    this.listImageHandler = [];
  }

  // Truyền danh sách hình ảnh được chọn cho output
  getListImageOutput() {
    this.getListImageSelected.emit(this.listImageHandler);
  }

  makeThumbnail(image: DTOImageProduct) {
    this.listImageHandler.forEach((img: DTOImageProduct) => {
      if (img === image) {
        img.IsThumbnail = true;
      }
      else {
        img.IsThumbnail = false;
      }
    })
  }
}

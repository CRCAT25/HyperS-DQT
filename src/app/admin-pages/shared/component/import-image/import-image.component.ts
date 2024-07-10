import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { UploadImageService } from '../../service/uploadImage.service';
import { DTOImageProduct } from 'src/app/ecom-pages/shared/dto/DTOImageProduct';
import { NotiService } from 'src/app/ecom-pages/shared/service/noti.service';

type ImagePreview = {
  src: string | ArrayBuffer;
  uid: string;
};

@Component({
  selector: 'component-import-image',
  templateUrl: './import-image.component.html',
  styleUrls: ['./import-image.component.scss']
})
export class ImportImageComponent implements OnInit {
  public events: string[] = [];
  @Output() fileSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() srcImage: string;
  @Input() text: string = '';
  // @Input() width: number = 300;
  // @Input() minWidth: number = 100;
  @Input() imgWidth: number = 200;
  @Input() imgMinWidth: number = 100;
  @Input() imgHeight: number = 200;
  @Input() imgMinHeight: number = 150;
  @Input() gap: number = 50;
  @Input() rounded: number = 2;
  selectedFile: File | null = null;

  imageHandle: DTOImageProduct = new DTOImageProduct();

  constructor(private uploadImageService: UploadImageService, private notiService: NotiService) { }

  ngOnInit(): void {
    if(this.srcImage){
      this.imageHandle.ImgUrl = this.srcImage;
    }
  }

  fileRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png"],
  };

  // Chọn file ảnh
  onFileSelected(event: any) {
    if (event) {
      this.selectedFile = event.files[0].rawFile;
    }
    this.onUpload();
  }

  // Upload hình ảnh lên imgBB
  onUpload() {
    if (this.selectedFile) {
      this.uploadImageService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          this.imageHandle = {
            "Code": null,
            "IdImage": null,
            "ImgUrl": response.data.url,
            "IsThumbnail": true
          }
          this.fileSelected.emit(this.imageHandle);
        },
        (error) => {
          window.location.reload();
          this.notiService.Show('Xảy ra lỗi trong quá trình upload ảnh', 'error');
          // console.error('Error uploading image:', error);
        }
      );
    }
  }

  setImgURL(imgURL: string){
    this.imageHandle.ImgUrl = imgURL;
  }

  public delete() {
    this.selectedFile = null;
    this.imageHandle = new DTOImageProduct();
    this.fileSelected.emit('');
  }
}

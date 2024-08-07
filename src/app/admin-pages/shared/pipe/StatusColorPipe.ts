import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor'
})

/**
 * StatusColorPipe using for change style color base on text status
 * Using example: 
 * In file ts: Create variable status: string = 'Đang soạn thảo' or something else
 * In file html: <div [style.color]="status | statusColor">{{ status }}</div>
 */
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case '':
        return '#23282c';
      case 'Chờ xác nhận':
        return '#23282c';
      case 'Không xác nhận':
        return '#FF1D1D';
      case 'Xác nhận':
        return '#1D4CF2';
      case 'Đã xác nhận':
        return '#1D4CF2';
      case 'Đang đóng gói':
        return '#EC7C2B';
      case 'Đóng gói':
        return '#EC7C2B';
      case 'Đã đóng gói':
        return '#7717C2';
      case 'Vận chuyển':
        return '#2480BD';
      case 'Đang vận chuyển':
        return '#2480BD';
      case 'Giao hàng thất bại':
        return '#FF1D1D';
      case 'Giao hàng thành công':
        return '#09880E'
      case 'Đơn hàng bị hủy':
        return '#FF1D1D'
      case 'Trả về':
        return '#2480BD'
      case 'Đơn hàng đang trả về':
        return '#2480BD'
      case 'Xác nhận nhận hàng':
        return '#F1802E'
      case 'Xác nhận đã nhận hàng':
        return '#F1802E'
      case 'Đã hoàn tiền':
        return '#F1802E'
      case 'Không hoàn tiền':
        return '#FF1D1D'
      case 'Yêu cầu đổi trả hàng':
        return '#1D4CF2'
      case 'Xác nhận đổi hàng':
        return '#F1802E'
      case 'Xác nhận đổi trả':
        return '#F1802E'
      case 'Đổi hàng':
        return '#F1802E'
      case 'Đã đổi hàng':
        return '#F1802E'
      case 'Chờ thanh toán':
        return '#8F8F8F'
      case 'Yêu cầu đổi hàng':
        return '#1D4CF2'
      case 'Yêu cầu trả hàng':
        return '#1D4CF2'
      case 'Từ chối đổi hàng':
        return '#FF1D1D'
      case 'Từ chối trả hàng':
        return '#FF1D1D'
      case 'Hoàn tất đơn hàng':
        return '#09880E'
      case 'Hoạt động':
        return '#09880E'
      case 'Đang được sử dụng':
        return '#09880E'
      case 'Đang kinh doanh':
        return '#09880E'
      case 'Sản phẩm đang kinh doanh':
        return '#09880E'
      case 'Vô hiệu hóa':
        return '#FF1D1D'
      case 'Ngừng kinh doanh':
        return '#FF1D1D'
      case 'Ngưng hoạt động':
        return '#FF1D1D'
      case 'Sản phẩm ngưng kinh doanh':
        return '#FF1D1D'
      case 'Đợi duyệt':
        return '#2480BD';
      case 'Duyệt áp dụng':
        return '#09880E';
      case 'Ngưng áp dụng':
        return '#FF1D1D';
      default:
        return 'black';
    }
  }
}
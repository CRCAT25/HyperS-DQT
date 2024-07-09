import { DTOStatus } from "./DTOStatus.dto";

export class DTOBanner{

}

export const listStatusBanner: DTOStatus[] = [
    {
        Code: 0,
        Status: 'Đang được sử dụng',
        IsChecked: true
    },
    {
        Code: 1,
        Status: 'Ngưng hoạt động',
        IsChecked: false
    }
]

export const listPage: {Code: number, Page: string, ListPosition: number[]}[] = [
    {
        Code: 0,
        Page: 'Trang chủ ecom',
        ListPosition: [1, 2, 3]
    }
]
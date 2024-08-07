import { DTOStatus } from "./DTOStatus.dto";

export class DTOBanner{
    Code: number
    Title: string
    BannerType: number
    BannerUrl: string
    Position: number
    Page: string
    Status: number
}

export class DTOPositionInPage{
    Code: number
    Position: string
}

export class DTOPageEcom{
    Code: number 
    Page: string
    ListPosition?: DTOPositionInPage[]
    ImgStructure?: string
}

export class DTOBannerType{
    Code: number
    Type: string
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

export const listPageEcom: DTOPageEcom[] = [
    {
        Code: 0,
        Page: 'Trang chủ Ecom',
        ListPosition: [
            {
                Code: 1,
                Position: 'Vị trí 1'
            },
            {
                Code: 2,
                Position: 'Vị trí 2'
            },
            {
                Code: 3,
                Position: 'Vị trí 3'
            }
        ],
        ImgStructure: 'https://i.ibb.co/8xSQNB4/structure-page-ecom.png'
    }
]

export const listActionChangeStatusBanner: DTOStatus[] = [
    {
        Code: 0,
        Status: 'Chỉnh sửa',
        Icon: 'fa-pencil'
    },
    {
        Code: 1,
        Status: 'Kích hoạt',
        Icon: 'fa-circle-check'
    }
]

export const listBannerType: DTOBannerType[] = [
    {
        Code: 0,
        Type: 'Hình ảnh'
    },
    {
        Code: 1,
        Type: 'Đoạn video'
    }
]
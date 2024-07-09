import { DTOStatus } from "./DTOStatus.dto"

export class DTOCoupon {
    Code: number = 0
    IdCoupon: string
    Description: string
    StartDate: string
    EndDate: string
    Quantity: number
    RemainingQuantity: number
    MinBillPrice: number
    MaxBillDiscount?: number
    Status: number
    Stage: number
    CouponType: number
    DirectDiscount?: number
    PercentDiscount?: number
    ApplyTo: number
}

export class DTOCouponType{
    Code: number
    Type: string
}

export const listActionChangeStatusCoupon: DTOStatus[] = [
    {
        Code: 0,
        Status: 'Chỉnh sửa',
        Icon: 'fa-pencil'
    },
    {
        Code: 1,
        Status: 'Xem chi tiết',
        Icon: 'fa-eye'
    },
    {
        Code: 2,
        Status: 'Gửi duyệt',
        Icon: 'fa-share'
    },
    {
        Code: 3,
        Status: 'Phê duyệt',
        Icon: 'fa-circle-check'
    },
    {
        Code: 4,
        Status: 'Ngừng áp dụng',
        Icon: 'fa-circle-minus'
    }
]

export const listCouponType : DTOCouponType[] = [
    {
        Code: 0,
        Type: 'Theo phần trăm'
    },
    {
        Code: 1,
        Type: 'Giảm giá trực tiếp'
    }
]
export class DTOCoupon {
    Code: number
    IdCoupon: string
    Description: string
    StartDate: Date
    EndDate: Date
    Quantity: number
    RemainingQuantity: number
    MinPrice: number
    MaxDiscount?: number
    Status: number
    Stage: number
    CouponType: number
    DirectDiscout?: number
    PercentDiscout?: number
    ApplyTo: number
}
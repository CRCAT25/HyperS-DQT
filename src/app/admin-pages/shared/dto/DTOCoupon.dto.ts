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
    MaxBillDiscount?: number = 0
    Status: number
    Stage: number
    CouponType: number
    DirectDiscout?: number = 0
    PercentDiscout?: number = 0
    ApplyTo: number = 0
}

export const listCoupon: DTOCoupon[] = [
    {
        Code: 100001,
        IdCoupon: "COUPON1",
        Description: "Mô tả khuyến mãi 1",
        StartDate: "2024-07-01T00:00:00",
        EndDate: "2024-07-10T23:59:59",
        Quantity: 500,
        RemainingQuantity: 250,
        MinBillPrice: 50000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 100000,
        PercentDiscout: 0,
        ApplyTo: 1
    },
    {
        Code: 100002,
        IdCoupon: "COUPON2",
        Description: "Mô tả khuyến mãi 2",
        StartDate: "2024-07-05T00:00:00",
        EndDate: "2024-07-15T23:59:59",
        Quantity: 600,
        RemainingQuantity: 300,
        MinBillPrice: 45000,
        MaxBillDiscount: 30000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 10,
        ApplyTo: 0
    },
    {
        Code: 100003,
        IdCoupon: "COUPON3",
        Description: "Mô tả khuyến mãi 3",
        StartDate: "2024-07-10T00:00:00",
        EndDate: "2024-07-20T23:59:59",
        Quantity: 700,
        RemainingQuantity: 400,
        MinBillPrice: 70000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 100000,
        PercentDiscout: 0,
        ApplyTo: 0
    },
    {
        Code: 100004,
        IdCoupon: "COUPON4",
        Description: "Mô tả khuyến mãi 4",
        StartDate: "2024-07-15T00:00:00",
        EndDate: "2024-07-25T23:59:59",
        Quantity: 800,
        RemainingQuantity: 450,
        MinBillPrice: 40000,
        MaxBillDiscount: 35000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 20,
        ApplyTo: 1
    },
    {
        Code: 100005,
        IdCoupon: "COUPON5",
        Description: "Mô tả khuyến mãi 5",
        StartDate: "2024-07-20T00:00:00",
        EndDate: "2024-07-30T23:59:59",
        Quantity: 900,
        RemainingQuantity: 500,
        MinBillPrice: 50000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 300,
        PercentDiscout: 0,
        ApplyTo: 1
    },
    {
        Code: 100006,
        IdCoupon: "COUPON6",
        Description: "Mô tả khuyến mãi 6",
        StartDate: "2024-07-25T00:00:00",
        EndDate: "2024-08-04T23:59:59",
        Quantity: 1000,
        RemainingQuantity: 550,
        MinBillPrice: 100000,
        MaxBillDiscount: 50000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 30,
        ApplyTo: 0
    },
    {
        Code: 100007,
        IdCoupon: "COUPON7",
        Description: "Mô tả khuyến mãi 7",
        StartDate: "2024-07-30T00:00:00",
        EndDate: "2024-08-09T23:59:59",
        Quantity: 1100,
        RemainingQuantity: 600,
        MinBillPrice: 70000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 40000,
        PercentDiscout: 0,
        ApplyTo: 1
    },
    {
        Code: 100008,
        IdCoupon: "COUPON8",
        Description: "Mô tả khuyến mãi 8",
        StartDate: "2024-08-04T00:00:00",
        EndDate: "2024-08-14T23:59:59",
        Quantity: 1200,
        RemainingQuantity: 650,
        MinBillPrice: 80000,
        MaxBillDiscount: 50000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 40,
        ApplyTo: 0
    },
    {
        Code: 100009,
        IdCoupon: "COUPON9",
        Description: "Mô tả khuyến mãi 9",
        StartDate: "2024-08-09T00:00:00",
        EndDate: "2024-08-19T23:59:59",
        Quantity: 1300,
        RemainingQuantity: 700,
        MinBillPrice: 100000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 500,
        PercentDiscout: 0,
        ApplyTo: 0
    },
    {
        Code: 100010,
        IdCoupon: "COUPON10",
        Description: "Mô tả khuyến mãi 10",
        StartDate: "2024-08-14T00:00:00",
        EndDate: "2024-08-24T23:59:59",
        Quantity: 1400,
        RemainingQuantity: 750,
        MinBillPrice: 100000,
        MaxBillDiscount: 50000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 50,
        ApplyTo: 0
    },
    {
        Code: 100011,
        IdCoupon: "COUPON11",
        Description: "Mô tả khuyến mãi 11",
        StartDate: "2024-08-19T00:00:00",
        EndDate: "2024-08-29T23:59:59",
        Quantity: 1500,
        RemainingQuantity: 800,
        MinBillPrice: 110000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 600,
        PercentDiscout: 0,
        ApplyTo: 0
    },
    {
        Code: 100012,
        IdCoupon: "COUPON12",
        Description: "Mô tả khuyến mãi 12",
        StartDate: "2024-08-24T00:00:00",
        EndDate: "2024-09-03T23:59:59",
        Quantity: 1600,
        RemainingQuantity: 850,
        MinBillPrice: 120000,
        MaxBillDiscount: 100000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 60,
        ApplyTo: 0
    },
    {
        Code: 100013,
        IdCoupon: "COUPON13",
        Description: "Mô tả khuyến mãi 13",
        StartDate: "2024-08-29T00:00:00",
        EndDate: "2024-09-08T23:59:59",
        Quantity: 1700,
        RemainingQuantity: 900,
        MinBillPrice: 130000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 70000,
        PercentDiscout: 0,
        ApplyTo: 0
    },
    {
        Code: 100014,
        IdCoupon: "COUPON14",
        Description: "Mô tả khuyến mãi 14",
        StartDate: "2024-09-03T00:00:00",
        EndDate: "2024-09-13T23:59:59",
        Quantity: 1800,
        RemainingQuantity: 950,
        MinBillPrice: 140000,
        MaxBillDiscount: 100000,
        Status: 0,
        Stage: 0,
        CouponType: 0,
        DirectDiscout: 0,
        PercentDiscout: 70,
        ApplyTo: 0
    },
    {
        Code: 100015,
        IdCoupon: "COUPON15",
        Description: "Mô tả khuyến mãi 15",
        StartDate: "2024-09-08T00:00:00",
        EndDate: "2024-09-18T23:59:59",
        Quantity: 1900,
        RemainingQuantity: 1000,
        MinBillPrice: 250000,
        MaxBillDiscount: 0,
        Status: 0,
        Stage: 0,
        CouponType: 1,
        DirectDiscout: 80000,
        PercentDiscout: 0,
        ApplyTo: 0
    }
];


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
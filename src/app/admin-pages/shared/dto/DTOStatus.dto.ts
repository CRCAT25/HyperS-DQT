export class DTOStatus {
    Code: number;
    Status: string;
    Icon?: string;
    IsChecked?: boolean
    ListNextStatus?: DTOStatus[]
}

export const listStatus: DTOStatus[] = [
    {
        Code: 0,
        Status: "Xem chi tiết",
        Icon: "fa-eye",
        IsChecked: false
    },
    {
        Code: 1,
        Status: "Chờ xác nhận",
        Icon: "fa-clock-rotate-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
                {
                    Code: 3,
                    Status: "Không xác nhận",
                    Icon: "fa-circle-xmark",
                    IsChecked: false

                },
                {
                    Code: 4,
                    Status: "Đã xác nhận",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 2,
        Status: "Đơn hàng bị hủy",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
            ]
    },
    {
        Code: 3,
        Status: "Không xác nhận",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
            ]
    },
    {
        Code: 4,
        Status: "Đã xác nhận",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 5,
                    Status: "Đang đóng gói",
                    Icon: "fa-box",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 5,
        Status: "Đang đóng gói",
        Icon: "fa-box",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 6,
                    Status: "Đã đóng gói",
                    Icon: "fa-boxes-stacked",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 6,
        Status: "Đã đóng gói",
        Icon: "fa-boxes-stacked",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 7,
                    Status: "Đang vận chuyển",
                    Icon: "fa-cart-flatbed",
                    IsChecked: false,
                }
            ]
    },
    {
        Code: 7,
        Status: "Đang vận chuyển",
        Icon: "fa-cart-flatbed",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 8,
                    Status: "Giao hàng thành công",
                    Icon: "fa-circle-check",
                    IsChecked: false,
                },

                {
                    Code: 9,
                    Status: "Giao hàng thất bại",
                    Icon: "fa-circle-xmark",
                    IsChecked: false,
                }
            ]
    },
    {
        Code: 8,
        Status: "Giao hàng thành công",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
                {
                    Code: 22,
                    Status: "Hoàn tất đơn",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 9,
        Status: "Giao hàng thất bại",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 10,
                    Status: "Đang trả về",
                    Icon: "fa-cart-flatbed",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 10,
        Status: "Đơn hàng đang trả về",
        Icon: "fa-rotate-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 11,
                    Status: "Xác nhận đã nhận hàng",
                    Icon: "fa-box-open",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 11,
        Status: "Xác nhận đã nhận hàng",
        Icon: "fa-box-open",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                {
                    Code: 12,
                    Status: "Đã hoàn tiền",
                    Icon: "fa-circle-check",
                    IsChecked: false,
                },
                {
                    Code: 13,
                    Status: "Không hoàn tiền",
                    Icon: "fa-circle-xmark",
                    IsChecked: false,
                }
            ]
    },
    {
        Code: 12,
        Status: "Đã hoàn tiền",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                }
            ]
    },
    {
        Code: 13,
        Status: "Không hoàn tiền",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
                {
                    Code: 22,
                    Status: "Hoàn tất đơn",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 14,
        Status: "Yêu cầu đổi trả hàng",
        Icon: "fa-arrow-right-arrow-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false

                },
                // {
                //     Code: 16,
                //     Status: "Xác nhận đổi trả",
                //     Icon: "fa-cart-flatbed",
                //     IsChecked: false,
                // },
                // {
                //     Code: 20,
                //     Status: "Từ chối đổi hàng",
                //     Icon: "fa-circle-xmark",
                //     IsChecked: false,
                // },
                // {
                //     Code: 21,
                //     Status: "Từ chối trả hàng",
                //     Icon: "fa-circle-xmark",
                //     IsChecked: false,
                // },
                {
                    Code: 22,
                    Status: "Hoàn tất đơn",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 16,
        Status: "Xác nhận đổi trả",
        Icon: "fa-cart-flatbed",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
            ]
    },
    {
        Code: 17,
        Status: "Chờ thanh toán",
        Icon: "fa-coins",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
            ]
    },
    {
        Code: 20,
        Status: "Từ chối đổi hàng",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
                {
                    Code: 22,
                    Status: "Hoàn tất đơn hàng",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 21,
        Status: "Từ chối trả hàng",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
                {
                    Code: 22,
                    Status: "Hoàn tất đơn hàng",
                    Icon: "fa-circle-check",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 22,
        Status: "Hoàn tất đơn hàng",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 0,
                    Status: "Xem chi tiết",
                    Icon: "fa-eye",
                    IsChecked: false
                },
            ]
    }

]

export const filteredStatusList: DTOStatus[] = listStatus.filter(status => status.Code !== 0);

export const listStatusNoView: DTOStatus[] = JSON.parse(JSON.stringify(filteredStatusList)).map((item: DTOStatus) => {
    if (item.ListNextStatus) {
        item.ListNextStatus = item.ListNextStatus.filter((subItem: DTOStatus) => subItem.Code !== 0);
    }
    return item;
});

export const listStatusOfBillInfo: DTOStatus[] = [
    {
        Code: 8,
        Status: "Giao hàng thành công",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 14,
                    Status: "Yêu cầu đổi hàng",
                    Icon: "fa-arrow-right-arrow-left",
                    IsChecked: false,
                },
                {
                    Code: 15,
                    Status: "Yêu cầu trả hàng",
                    Icon: "fa-arrow-right-arrow-left",
                    IsChecked: false,
                }
            ]
    },
    {
        Code: 10,
        Status: "Trả về",
        Icon: "fa-rotate-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 11,
                    Status: "Xác nhận nhận hàng",
                    Icon: "fa-box-open",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 11,
        Status: "Xác nhận nhận hàng",
        Icon: "fa-box-open",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 12,
                    Status: "Hoàn tiền",
                    Icon: "fa-circle-check",
                    IsChecked: false,
                },
                {
                    Code: 13,
                    Status: "Không hoàn tiền",
                    Icon: "fa-circle-xmark",
                    IsChecked: false,
                }
            ]
    },
    {
        Code: 12,
        Status: "Hoàn tiền",
        Icon: "fa-circle-check",
        IsChecked: false,

    },
    {
        Code: 13,
        Status: "Không hoàn tiền",
        Icon: "fa-circle-xmark",
        IsChecked: false,
    },
    {
        Code: 14,
        Status: "Yêu cầu đổi hàng",
        Icon: "fa-arrow-right-arrow-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 18,
                    Status: "Xác nhận đổi hàng",
                    Icon: "fa-cart-flatbed",
                    IsChecked: false
                },
                {
                    Code: 20,
                    Status: "Từ chối đổi hàng",
                    Icon: "fa-circle-xmark",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 15,
        Status: "Yêu cầu trả hàng",
        Icon: "fa-arrow-right-arrow-left",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 10,
                    Status: "Trả về",
                    Icon: "fa-cart-flatbed",
                    IsChecked: false
                },
                {
                    Code: 21,
                    Status: "Từ chối trả hàng",
                    Icon: "fa-circle-xmark",
                    IsChecked: false
                }
            ]
    },
    {
        Code: 17,
        Status: "Chờ thanh toán",
        Icon: "fa-coins",
        IsChecked: false,
        ListNextStatus: []
    },
    {
        Code: 18,
        Status: "Xác nhận đổi hàng",
        Icon: "fa-cart-flatbed",
        IsChecked: false,
        ListNextStatus:
            [
                {
                    Code: 19,
                    Status: "Đã đổi hàng",
                    Icon: "fa-circle-check",
                    IsChecked: false,
                }
            ]
    }
]

export const listStatusActive: DTOStatus[] = [
    {
        Code: 0,
        Status: "Kích hoạt",
        Icon: "fa-circle-check",
        IsChecked: false
    },
    {
        Code: 1,
        Status: "Ngừng kinh doanh",
        Icon: "fa-circle-minus",
        IsChecked: false
    }
]

export const listStatusCustomer: DTOStatus[] = [
    {
        Code: 0,
        Status: "Kích hoạt",
        Icon: "fa-circle-check",
        IsChecked: false
    },
    {
        Code: 1,
        Status: "Vô hiệu hóa",
        Icon: "fa-circle-minus",
        IsChecked: false
    }
]

export const listStatusCoupon: DTOStatus[] = [
    {
        Code: 0,
        Status: 'Đang tạo khuyến mãi',
        IsChecked: true
    },
    {
        Code: 1,
        Status: 'Đợi duyệt',
        IsChecked: true
    },
    {
        Code: 2,
        Status: 'Duyệt áp dụng',
        IsChecked: false
    },
    {
        Code: 3,
        Status: 'Ngưng áp dụng',
        IsChecked: false
    }
]

export const listStageCoupon: DTOStatus[] = [
    {
        Code: 0,
        Status: 'Chưa có hiệu lực',
        IsChecked: false
    },
    {
        Code: 1,
        Status: 'Đang có hiệu lực',
        IsChecked: false
    },
    {
        Code: 2,
        Status: 'Hết hiệu lực',
        IsChecked: false
    }
]

export class DTOStatus {
    Code: number;
    Status: string;
    Icon?: string;
    IsChecked?: boolean
    ListNextStatus?: DTOStatus[]
}

export const listStatus: DTOStatus[] = [
    {
        Code: 1,
        Status: "Xem chi tiết",
        Icon: "fa-eye",
        IsChecked: false
    },
    {
        Code: 2,
        Status: "Chờ xác nhận",
        Icon: "fa-share",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 3,
                Status: "Đang đóng gói",
                Icon: "fa-share",
                IsChecked: false
                
            },
            {   
                Code: 6,
                Status: "Đơn hàng bị hủy",
                Icon: "fa-circle-xmark",
                IsChecked: false
            }
        ]
    },
    {
        Code: 3,
        Status: "Đang đóng gói",
        Icon: "fa-box",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 4,
                Status: "Đang vận chuyển",
                Icon: "fa-cart-flatbed",
                IsChecked: false
            }
        ]
    },
    {
        Code: 4,
        Status: "Đang vận chuyển",
        Icon: "fa-cart-flatbed",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 5,
                Status: "Giao hàng thành công",
                Icon: "fa-circle-check",
                IsChecked: false
            },

            {
                Code: 7,
                Status: "Giao hàng thất bại",
                Icon: "fa-circle-xmark",
                IsChecked: false
            }
        ]
    },
    {
        Code: 5,
        Status: "Giao hàng thành công",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            }
        ]
    },
    {
        Code: 6,
        Status: "Đơn hàng bị hủy",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            }
        ]
    },
    {
        Code: 7,
        Status: "Giao hàng thất bại",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 8,
                Status: "Đang trả về",
                Icon: "fa-cart-flatbed",
                IsChecked: false
            }
        ]
    },
    {
        Code: 8,
        Status: "Đang trả về",
        Icon: "fa-rotate-left",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 9,
                Status: "Đã nhận lại hàng",
                Icon: "fa-circle-check",
                IsChecked: false
            }
        ]
    },
    {
        Code: 9,
        Status: "Đã nhận lại hàng",
        Icon: "fa-box-open",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            },
            {
                Code: 10,
                Status: "Đã hoàn tiền",
                Icon: "fa-circle-check",
                IsChecked: false,
            },
            {
                Code: 11,
                Status: "Không hoàn tiền",
                Icon: "fa-circle-xmark",
                IsChecked: false,
            }
        ]
    },
    {
        Code: 10,
        Status: "Đã hoàn tiền",
        Icon: "fa-circle-check",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            }
        ]
    },
    {
        Code: 11,
        Status: "Không hoàn tiền",
        Icon: "fa-circle-xmark",
        IsChecked: false,
        ListNextStatus:
        [
            {
                Code: 1,
                Status: "Xem chi tiết",
                Icon: "fa-eye",
                IsChecked: false
                
            }
        ]
    }
]

export const filteredStatusList: DTOStatus[] = listStatus.filter(status => status.Code !== 1);

export const listStatusNoView: DTOStatus[] = JSON.parse(JSON.stringify(filteredStatusList)).map((item: DTOStatus) => {
    if (item.ListNextStatus) {
        item.ListNextStatus = item.ListNextStatus.filter((subItem: DTOStatus) => subItem.Code !== 1);
    }
    return item;
});



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
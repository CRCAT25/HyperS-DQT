export class DTOModule {
    RouteLink: string
    ModuleName: string
    ClassIconFontAwesome?: string
    SubModule?: DTOModule[]
    IsChild: boolean
    IsSelected: boolean
    IsExpanded: boolean
    ParentModule?: string
    BreadCrumb?: string
}

export const listModule: DTOModule[] = [
    {
        RouteLink: '/admin',
        ModuleName: 'Quản lý tài khoản',
        ClassIconFontAwesome: 'fa-user',
        SubModule: [
            {
                RouteLink: '/admin/manage-user',
                ModuleName: 'Thông tin khách hàng',
                IsChild: true,
                IsSelected: false,
                ParentModule: 'Quản lý tài khoản',
                IsExpanded: false,
                BreadCrumb: 'Quản lý tài khoản/Thông tin khách hàng'
            },
            {
                RouteLink: '/admin/manage-staff',
                ModuleName: 'Thông tin nhân viên',
                IsChild: true,
                IsSelected: false,
                ParentModule: 'Quản lý tài khoản',
                IsExpanded: false,
                BreadCrumb: 'Quản lý tài khoản/Thông tin nhân viên'
            }
        ],
        IsChild: false,
        IsSelected: false,
        IsExpanded: false
    },
    {
        RouteLink: '/admin',
        ModuleName: 'Quản lý sản phẩm',
        ClassIconFontAwesome: 'fa-store',
        SubModule: [
            {
                RouteLink: '/admin/manage-product',
                ModuleName: 'Danh sách sản phẩm',
                IsChild: true,
                IsSelected: false,
                ParentModule: 'Quản lý sản phẩm',
                IsExpanded: false,
                BreadCrumb: 'Quản lý sản phẩm/Danh sách sản phẩm'
            },
            {
                RouteLink: '/admin/manage-category',
                ModuleName: 'Thương hiệu và phân loại',
                IsChild: true,
                IsSelected: false,
                ParentModule: 'Quản lý sản phẩm',
                IsExpanded: false,
                BreadCrumb: 'Quản lý sản phẩm/Thương hiệu và phân loại'
            }
        ],
        IsChild: false,
        IsSelected: false,
        IsExpanded: false,
        BreadCrumb: 'Quản lý sản phẩm'
    },
    // {
    //     RouteLink: '/admin/manage-module',
    //     ModuleName: 'Quản lý danh mục',
    //     ClassIconFontAwesome: 'fa-rectangle-list',
    //     IsChild: false,
    //     IsSelected: false,
    //     IsExpanded: false,
    //     BreadCrumb: 'Quản lý danh mục'
    // },
    {
        RouteLink: '/admin/manage-dashboard',
        ModuleName: 'Dashboard',
        ClassIconFontAwesome: 'fa-chart-column',
        IsChild: false,
        IsSelected: false,
        IsExpanded: false,
        BreadCrumb: 'Dashboard'
    },
    {
        RouteLink: '/admin/manage-coupon',
        ModuleName: 'Quản lý khuyến mãi',
        ClassIconFontAwesome: 'fa-gift',
        IsChild: false,
        IsSelected: false,
        IsExpanded: false,
        BreadCrumb: 'Quản lý khuyến mãi'
    },
    {
        RouteLink: '/admin/manage-banner',
        ModuleName: 'Quản lý BANNER',
        ClassIconFontAwesome: 'fa-pager',
        IsChild: false,
        IsSelected: false,
        IsExpanded: false,
        BreadCrumb: 'Quản lý banner'
    },
    {
        RouteLink: '/admin/manage-cart',
        ModuleName: 'Đơn hàng',
        ClassIconFontAwesome: 'fa-cart-shopping',
        IsChild: false,
        IsSelected: true,
        IsExpanded: false,
        BreadCrumb: 'Đơn hàng'
    },
    // {
    //     RouteLink: '/admin/manage-schedule',
    //     ModuleName: 'Quản lý lịch làm việc',
    //     ClassIconFontAwesome: 'fa-calendar-days',
    //     IsChild: false,
    //     IsSelected: false,
    //     IsExpanded: false,
    //     BreadCrumb: 'Quản lý lịch làm việc'
    // },
    // {
    //     RouteLink: '/admin/calculate-salary',
    //     ModuleName: 'Tính lương',
    //     ClassIconFontAwesome: 'fa-money-check-dollar',
    //     IsChild: false,
    //     IsSelected: false,
    //     IsExpanded: false,
    //     BreadCrumb: 'Tính lương'
    // }
]

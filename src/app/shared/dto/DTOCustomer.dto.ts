export class DTOCustomer {
    Code: number
    IDCustomer: string
    Name: string
    ImageURL: string
    Gender: number
    Birth: Date
    PhoneNumber: string
    Email: string
    CodeAccount: number
    StatusAccount: number
    StatusAccountStr: string
    Permission?: number
    PermissionStr?: string
}

export class DTOGroupCustomer{
    Code: number
    Group: string
}

export const listGroupCustomer: DTOGroupCustomer[] = [
    {
        Code: 0,
        Group: 'Tất cả'
    },
    {
        Code: 1,
        Group: 'Có tài khoản'
    }
]
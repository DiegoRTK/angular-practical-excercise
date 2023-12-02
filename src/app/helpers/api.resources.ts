export const ApiResources = { 
    product: {
        base: 'bp/products',
        byId: (id:string) => `bp/products?id=${id}`,
        validateById: (id:string) => `bp/products/verification?id=${id}`
    }
}
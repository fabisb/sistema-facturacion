const render = ()=>{
    try {
        
        const {data: productos} = axios.get(urlsv+'/api/factura/productos');
        console.log("🚀 ~ file: facturar.js:3 ~ render ~ productos:", productos)
    } catch (error) {
        console.log(error)

    }
    
}
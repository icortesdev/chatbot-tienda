// (1) Seccion de importaciones
const axios = require('axios').default
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const API = 'https://fakestoreapi.com/products'

const flujoDeProductos = addKeyword('VER PRODUCTOS')
    .addAnswer('Consultando items en la base de datos...', null,
        async (ctx, { flowDynamic }) => {
            const respuesta = await axios(API)
            
            for(const item of respuesta.data){
                if(contador > 4) break; // cuando contador es mayor que 4 rompe el ciclo
                contador++ //contador incrementa 1 
                flowDynamic({body: item.title, media: item.image})
            }
        })

const flujoPrincipal = addKeyword('hola')
    .addAnswer('Bienvenido a mi ecommerce a continuacion puedes ver una lista de productos',
        {
            buttons: [
                {
                    body: 'VER PRODUCTOS'
                }
            ]
        },
        null,
        [flujoDeProductos]
    )

// (2) DEFINIMOS LA FUNCION PRINCIPAL
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

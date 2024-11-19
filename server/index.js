import express from "express";
import cors from "cors";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7939132507810260-111818-8e385e651a834a6bf31241d4460907cf-2106534640'});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("soy el server");
});

app.post("/create_preference", async (req, res) => {
    try{
        const body = {
            items: [
                {
                  title: req.body.title,
                  quantity: Number(req.body.quantity),
                  unit_price: Number(req.body.price),
                },
              ],
              back_urls: {
                success: "https://www.barreramotoshop.com.ar/",
                failure: "https://www.barreramotoshop.com.ar/",
                pending:"https://www.barreramotoshop.com.ar/",
              },
              auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :( ",
        });
    }
});

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});
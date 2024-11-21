import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import pool from "./db.js"; // Importa la conexión a la base de datos

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7939132507810260-111818-8e385e651a834a6bf31241d4460907cf-2106534640' });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint principal
app.get("/", (req, res) => {
    res.send("Soy el servidor");
});

// Endpoint para obtener datos del club y la reserva
app.get("/club_reserva/:id_club/:id_reserva", async (req, res) => {
    const { id_club, id_reserva } = req.params;

    try {
        const connection = await pool.getConnection();
        try {
            // Consulta para obtener la información del club
            const [clubRows] = await connection.query(
                "SELECT nombreClub, direccion FROM club WHERE id_club = ?",
                [id_club]
            );

            if (clubRows.length === 0) {
                return res.status(404).json({ error: "Club no encontrado" });
            }

            // Consulta para obtener la información de la reserva
            const [reservaRows] = await connection.query(
                "SELECT hora_inicio, hora_fin FROM reservas WHERE id_reserva = ?",
                [id_reserva]
            );

            if (reservaRows.length === 0) {
                return res.status(404).json({ error: "Reserva no encontrada" });
            }

            res.json({
                club: clubRows[0],
                reserva: reservaRows[0],
                fechaActual: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error al obtener datos del club y reserva:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Obtener información de un club
app.get("/club/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT nombreClub, direccion FROM club WHERE id_club = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Club no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener información del club" });
    }
});

// Obtener información de una reserva
app.get("/reserva/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT hora_inicio, hora_fin FROM reservas WHERE id_reserva = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Reserva no encontrada" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener información de la reserva" });
    }
});



// Endpoint para crear la preferencia y registrar la transacción
app.post("/create_preference", async (req, res) => {
    try {
        // Crea un número aleatorio de 8 cifras para transaction_id
        const transactionId = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Mapeo de nombres de planes a los valores esperados
        const planNames = {
            "Mensual": "Mensual",
            "Trimestral": "Trimestral",
            "Semestral": "Semestral",
        };

        const planTitle = planNames[req.body.title] || req.body.title;

        // Datos para la preferencia
        const body = {
            items: [
                {
                    title: planTitle, // Usa el título del plan actualizado
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                },
            ],
            back_urls: {
                success: "https://www.barreramotoshop.com.ar/",
                failure: "https://www.barreramotoshop.com.ar/",
                pending: "https://www.barreramotoshop.com.ar/",
            },
            auto_return: "approved",
        };

        // Crea la preferencia
        const preference = new Preference(client);
        const result = await preference.create({ body });

        // Guarda la transacción en la base de datos
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "INSERT INTO transactions (transaction_id, plan) VALUES (?, ?)",
                [transactionId, planTitle]
            );
        } finally {
            connection.release(); // Libera la conexión
        }

        res.json({
            id: result.id,
            transactionId, // Devuelve también el transaction_id generado
        });
    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).json({
            error: "Error al crear la preferencia :( ",
        });
    }
});

// Levanta el servidor
app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});

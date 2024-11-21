import "./Product.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState, useEffect } from "react";

const Product = ({ idClub, idReserva }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [clubInfo, setClubInfo] = useState({});
    const [reservaInfo, setReservaInfo] = useState({});
    const [fechaActual, setFechaActual] = useState("");

    initMercadoPago('APP_USR-4d6df3ac-b04a-430c-928d-9d5031b9892b');

    // Obtener la fecha actual al montar el componente
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("es-AR", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
        setFechaActual(formattedDate);
    }, []);

    // Obtener información del club y de la reserva desde la API
    useEffect(() => {
        const fetchClubAndReservaInfo = async () => {
            try {
                // Llama al backend para obtener datos del club
                const clubResponse = await axios.get(`http://localhost:3000/club/${idClub}`);
                setClubInfo(clubResponse.data);

                // Llama al backend para obtener datos de la reserva
                const reservaResponse = await axios.get(`http://localhost:3000/reserva/${idReserva}`);
                setReservaInfo(reservaResponse.data);
            } catch (error) {
                console.error("Error al obtener datos del club o la reserva:", error);
            }
        };

        fetchClubAndReservaInfo();
    }, [idClub, idReserva]);

    const createPreference = async () => {
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "El club",
                quantity: 1,
                price: 100,
            });

            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const Preference = await createPreference();
        if (Preference.id) {
            setPreferenceId(Preference.id);
        }
    };

    return (
        <div className="container product-container">
            {/* Título */}
            <div className="text-center mb-4">
                <h2 className="product-title">Ya casi terminamos!</h2>
                <p>
                    Para completar tu reserva en <strong>{clubInfo.nombreClub || "..."}</strong>, por favor chequeá
                    tus datos y luego confirmá.
                </p>
            </div>

            {/* Contenedor principal */}
            <div className="row">
                {/* Información del club */}
                <div className="col-lg-6 mb-3">
                    <div className="card shadow-sm rounded product-card">
                        <div className="card-body">
                            <h5 className="card-title">{clubInfo.nombreClub || "Cargando..."}</h5>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src="https://media.istockphoto.com/id/1381923417/es/vector/icono-del-logotipo-de-vintage-paddle-tennis-vector-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=eDxF-I8YDWBWQkOwVU7lhd6aUNY6FCqk6orOhYfsFP8="
                                    alt="Logo del Club"
                                    className="club-logo"
                                />
                                <span className="text-success ms-2">★★★★★</span>
                            </div>
                            <p>
                                <strong>Ubicación:</strong> {clubInfo.direccion || "Cargando..."}
                            </p>
                            <p>
                                <strong>Fecha:</strong> {fechaActual}
                            </p>
                            <p>
                                <strong>Turno:</strong> {reservaInfo.hora_inicio || "00:00"} - {reservaInfo.hora_fin || "00:00"}
                            </p>
                            <p>
                                <strong>Cancha:</strong> Padel 1
                            </p>
                            <p>
                                <strong>Precio:</strong> $5000
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información personal */}
                <div className="col-lg-6 mb-3">
                    <div className="card shadow-sm rounded product-card">
                        <div className="card-body">
                            <h5 className="card-title">Información personal</h5>
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="name">Nombre:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Ingresa tu nombre"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="phone">Teléfono:</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">AR +54</span>
                                        </div>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Ingresa tu teléfono"
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">E-mail:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Ingresa tu correo electrónico"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerta y botón */}
            <div className="mt-4 text-center">
                <div className="alert alert-warning rounded product-alert">
                    <strong>IMPORTANTE:</strong> Tarjeta en garantía. Abonarás el 100% del turno en el complejo. 
                    <br />
                    Se generará un cargo en caso de no presentarte o cancelar con menos de 1 hora de anticipación.
                </div>
                <button onClick={handleBuy} className="btn btn-success btn-lg w-100">
                    Confirmar reserva
                </button>
                {preferenceId && <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />}
            </div>
        </div>
    );
};

export default Product;

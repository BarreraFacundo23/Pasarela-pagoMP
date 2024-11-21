import "./Membresia.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState } from "react";

const Membresia = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Inicializa Mercado Pago al cargar el componente
    initMercadoPago('APP_USR-4d6df3ac-b04a-430c-928d-9d5031b9892b');

    // Crea preferencia en Mercado Pago según el plan seleccionado
    const createPreference = async (title, price) => {
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title,
                quantity: 1,
                price,
            });
            console.log("Respuesta del servidor:", response.data);
            return response.data; // Retorna la respuesta completa
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
            return null;
        }
    };

    // Maneja la acción de compra según el plan
    const handleBuy = async (title, price, plan) => {
        try {
            const preference = await createPreference(title, price);
            if (preference && preference.id) {
                setPreferenceId(preference.id);
                setSelectedPlan(plan);

                // Añade un delay de 3 segundos antes de mostrar el mensaje
                setTimeout(() => {
                    alert(`El número de transacción es: ${preference.transactionId}`);
                }, 3000); // 3000 milisegundos = 3 segundos
            } else {
                console.error("No se pudo obtener una preferencia válida.");
            }
        } catch (error) {
            console.error("Error en handleBuy:", error);
        }
    };

    return (
        <div className="membresia-container">
            <h2 className="text-center">ELIGE EL MEJOR PLAN PARA TI</h2>
            <p className="text-center text-success">AHORRA HASTA 30%</p>
            <div className="row">
                {/* Plan Mensual */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Mensual</h5>
                            <ul className="features">
                                <li>Servicio 24hs</li>
                                <li>Publicitacion de tu Negocio</li>
                                <li>Te conectamos con tus clientes de forma directa</li>
                                <li>Modenizacion de tu proyecto</li>
                            </ul>
                            <h4 className="price">$24.000</h4>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-success"
                                onClick={() => handleBuy("Mensual", 24000, "mensual")}
                            >
                                ELIGE ESTE PLAN
                            </button>
                            {selectedPlan === "mensual" && preferenceId && (
                                <Wallet 
                                    initialization={{ preferenceId }} 
                                    customization={{ texts: { valueProp: 'smart_option' } }} 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Plan Trimestral */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Trimestral</h5>
                            <ul className="features">
                                <li>Servicio 24hs</li>
                                <li>Publicitacion de tu Negocio</li>
                                <li>Te conectamos con tus clientes de forma directa</li>
                                <li>Modenizacion de tu proyecto</li>
                            </ul>
                            <h4 className="price">$45.000</h4>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-success"
                                onClick={() => handleBuy("Trimestral", 45000, "trimestral")}
                            >
                                ELIGE ESTE PLAN
                            </button>
                            {selectedPlan === "trimestral" && preferenceId && (
                                <Wallet 
                                    initialization={{ preferenceId }} 
                                    customization={{ texts: { valueProp: 'smart_option' } }} 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Plan Semestral */}
                <div className="col-md-4 d-flex justify-content-center">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Semestral</h5>
                            <ul className="features">
                                <li>Servicio 24hs</li>
                                <li>Publicitacion de tu Negocio</li>
                                <li>Te conectamos con tus clientes de forma directa</li>
                                <li>Modenizacion de tu proyecto</li>
                            </ul>
                            <h4 className="price">$73.000</h4>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-success"
                                onClick={() => handleBuy("Semestral", 73000, "semestral")}
                            >
                                ELIGE ESTE PLAN
                            </button>
                            {selectedPlan === "semestral" && preferenceId && (
                                <Wallet 
                                    initialization={{ preferenceId }} 
                                    customization={{ texts: { valueProp: 'smart_option' } }} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <p className="disclaimer">*Lleva tu negocio al próximo nivel con nuestros servicios de máxima calidad*</p>
        </div>
    );
};

export default Membresia;

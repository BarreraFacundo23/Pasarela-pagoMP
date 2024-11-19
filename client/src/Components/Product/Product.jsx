import "./Product.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";
import { useState } from "react";

const Product = () => {
    const [preferenceId, setPreferenceId] = useState(null);

    initMercadoPago('APP_USR-4d6df3ac-b04a-430c-928d-9d5031b9892b');

    const createPreference = async () => {
        try{
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "El club",
                quantity: 1,
                price: 100,
            });

            return response.data;
        } catch (error){
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
          Para completar tu reserva en <strong>El club</strong>, por favor chequeá
          tus datos y luego confirmá.
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="row justify-content-center">
        {/* Tarjeta del club */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm rounded product-card">
            <div className="card-body">
              <h5 className="card-title">El club</h5>
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://media.istockphoto.com/id/1381923417/es/vector/icono-del-logotipo-de-vintage-paddle-tennis-vector-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=eDxF-I8YDWBWQkOwVU7lhd6aUNY6FCqk6orOhYfsFP8="
                  alt="Logo del Club"
                  className="club-logo"
                />
                <span className="text-warning ms-2">★★★★★</span>
              </div>
              <p>
                <strong>Ubicación:</strong> San Juan 3000, Tucumán
              </p>
              <p>
                <strong>Fecha:</strong> sáb. 16/11/2024
              </p>
              <p>
                <strong>Turno:</strong> 20:00 - 21:00
              </p>
              <p>
                <strong>N° de Cancha:</strong> 1
              </p>
              <p>Blindex y cemento, Con iluminación, Descubierta</p>
              <p>
                <strong>Precio:</strong> $6500
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de información personal */}
        <div className="col-md-6 mb-3">
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
          Este complejo no exige la carga de una tarjeta como garantía para
          confirmar su reserva. Simplemente complete sus datos y presione el botón{" "}
          <strong>"Confirmar Reserva"</strong>.
          <br />
          <strong>
            Algunos clubes pueden solicitar una seña para confirmar la reserva. Cada
            club tiene su propia política de cancelación, por lo que recomendamos
            hacerlo con 24 horas de anticipación para evitar penalizaciones.
          </strong>
        </div>
        <button onClick={handleBuy} className="btn btn-success btn-lg w-100">
          Confirmar reserva
        </button>
        {preferenceId && <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />}


      </div>
    </div>
  );
};

export default Product;

import React, { useState } from "react";
import sellimage from "../../../assets/sell.png";
import bidimage from "../../../assets/bid.png";
import Menu from "@mui/material/Menu";
import axios from 'axios';
import { Controller, useForm } from "react-hook-form"
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { authorizationConfig } from '../../../security';
import CardsOnSell from "./CardsOnSell";


export default function SellMenu({card}) {

  const [sellMessage, setSellMessage] = useState(""); 
  const [bidMessage, setBidMessage] = useState(""); 

  
  const [anchorElSell, setAnchorElSell] = useState(null);
  const handleClickSell = (event) => {
    setAnchorElSell(event.currentTarget);
  };
  const handleCloseSell = () => {
    setAnchorElSell(null);
  };


  const [anchorElBid, setAnchorElBid] = useState(null);
  const handleClickBid = (event) => {
    setAnchorElBid(event.currentTarget);
  };
  const handleCloseBid = () => {
    setAnchorElBid(null);
  };


  const { control: sellControl, register: sellRegister, handleSubmit: sellHandleSubmit } = useForm();
  const { control: bidControl, register: bidRegister, handleSubmit: bidHandleSubmit, formState: bidFormState } = useForm();
  const [updateKey, setUpdateKey] = useState(0);

  const sellOnSubmit = async (formData) => {
    try {
      const userDataRes = await axios.get("http://localhost:5000/profile", authorizationConfig)
      let cardSelledData = {
        id_scryfall: card.id_scryfall,
        id_card: card._id,
        name: card.name,
        set_name: card.set_name,
        lang: formData.lang,
        foil: formData.sellFoil ? true : false,
        status: formData.status,
        type_sell: "Venta",
        price: formData.price,
        user_id: userDataRes.data._id,
      };      
      await axios.post('http://localhost:5000/cards/sellcard', cardSelledData);   
      setTimeout(() => {
        setUpdateKey(updateKey + 1);
        console.log('Carta puesta a la venta:', cardSelledData)
        setSellMessage("¡La carta se ha puesto a la venta!"); 
        }, 100);
   
    } catch (error) {
      console.log('Error al incluir la carta en la base de datos', error);
    }
  };

  const bidOnSubmit = async (formData) => {
    try {
      const userDataRes = await axios.get("http://localhost:5000/profile", authorizationConfig)
      let cardSelledData = {
        id_scryfall: card.id_scryfall,
        id_card: card._id,
        name: card.name,
        set_name: card.set_name,
        lang: formData.lang,
        foil: formData.sellFoil ? true : false,
        status: formData.status,
        type_sell: "Subasta",
        price: formData.price,
        end_of_bid: formData.end_of_bid,
        user_id: userDataRes.data._id,
      };
      
     await axios.post('http://localhost:5000/cards/sellcard', cardSelledData);
     setTimeout(() => {
      setUpdateKey(updateKey + 1);
      console.log('Carta puesta en subasta:', cardSelledData)
      setBidMessage("¡La carta se ha puesto en subasta!"); 
      }, 100); 
    } catch (error) {
      console.log('Error al incluir la carta en la base de datos', error);
    }
  };

  return (
    <div>
    <div className="sell-buttons-container">
      <div>
        <button className="sell-button" onClick={handleClickSell}>
          Vender <img className="card-detail-symbol-image" src={sellimage} alt="Vender" />
        </button>
        <button className="sell-button" onClick={handleClickBid}>
          Subastar <img className="card-detail-symbol-image" src={bidimage} alt="Subastar" />
        </button>
      </div>

      <Menu onSubmit={sellHandleSubmit(sellOnSubmit)}
        id="sellform"
        className="sell-form-box"
        component="form"
        //noValidate
        autoComplete="off"
        anchorEl={anchorElSell}
        open={Boolean(anchorElSell)}
        onClose={handleCloseSell}
      >
         <Controller
        name="sellFoil"
        control={sellControl}
        rules={{ required: false }}
        render={({ field }) => <FormGroup>
        <FormControlLabel control={<Checkbox {...field} />} label={"foil"}/>
        </FormGroup>}
        />
          <br />
          <label>Idioma de la carta: </label>
          <select id="lang" {...sellRegister("lang", { required: true })}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="de">Alemán</option>
            <option value="it">Italiano</option>
            <option value="zh">Chino</option>
            <option value="ja">Japonés</option>
            <option value="pt">Portugués</option>
          </select>

          <br />
          <label>Estado: </label>
          <select id="status" {...sellRegister("status", { required: true })}>
            <option value="new">Nueva</option>
            <option value="almost_new">Casi Nueva</option>
            <option value="excellent">Excelente</option>
            <option value="good">Buena</option>
            <option value="lightly_played">Ligeramente Jugada</option>
            <option value="played">Jugada</option>
            <option value="poor">Pobre</option>
          </select>

          <br />
          <label>Precio: </label>
          <input
            type="text"
            id="price"
            {...sellRegister("price", { required: true })}
          />
          <br />
          <button id="sellcard" type="submit" //disabled={!sellFormState.isValid}
          >
            Poner en Venta
          </button>
          {sellMessage && <p>{sellMessage}</p>}

      </Menu>

      <Menu onSubmit={bidHandleSubmit(bidOnSubmit)}
        id="bidform"
        className="bid-form-box"
        component="form"
        noValidate
        autoComplete="off"
        anchorEl={anchorElBid}
        open={Boolean(anchorElBid)}
        onClose={handleCloseBid}
      >
          <label>Foil: </label>
          <input
            type="checkbox"
            id="foil"
            {...bidRegister("foil", { required: false })}
          />
          <br />
          <label>Idioma de la carta: </label>
          <select id="lang" {...bidRegister("lang", { required: true })}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="de">Alemán</option>
            <option value="it">Italiano</option>
            <option value="zh">Chino</option>
            <option value="ja">Japonés</option>
            <option value="pt">Portugués</option>
          </select>

          <br />
          <label>Estado: </label>
          <select id="status" {...bidRegister("status", { required: true })}>
            <option value="new">Nueva</option>
            <option value="almost_new">Casi Nueva</option>
            <option value="excellent">Excelente</option>
            <option value="good">Buena</option>
            <option value="lightly_played">Ligeramente Jugada</option>
            <option value="played">Jugada</option>
            <option value="poor">Pobre</option>
          </select>

          <br />
          <label>Precio inicial: </label>
          <input
            type="text"
            id="price"
            {...bidRegister("price", { required: true })}
          />
          <br />
          <Controller
          name="end_of_bid"
          control={bidControl}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha fin de puja:"
                {...field}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(bidFormState.errors.end_of_bid)}
                    helperText={bidFormState.errors.end_of_bid?.message}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />
          <br />
          <button id="bidcard" type="submit" disabled={!bidFormState.isValid}>
            Poner en Subasta
          </button>
          {bidMessage && <p>{bidMessage}</p>}

      </Menu>
      

    </div>
    { <CardsOnSell key={updateKey} card={card.name}/>}
    </div>
   
  );
}

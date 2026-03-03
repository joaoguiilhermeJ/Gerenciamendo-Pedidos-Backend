import express from 'express';
import cors from 'cors';
import clienteRoutes from './routes/cliente.routes.js';

const app = express();


app.use(cors()); 
app.use(express.json()); 

app.use(clienteRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ erro: 'Algo deu errado no servidor de clientes!' });
});

export default app;
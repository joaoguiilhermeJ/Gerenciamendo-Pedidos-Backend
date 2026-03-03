import 'dotenv/config';
import app from './app.js';
import sequelize from './config/database.js';

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        
        await sequelize.sync({ force: false });
        console.log('Banco de dados SQLite sincronizado.');

        app.listen(PORT, () => {
            console.log(`Microserviço de Clientes rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o servidor:', error);
        process.exit(1); 
    }
}

startServer();
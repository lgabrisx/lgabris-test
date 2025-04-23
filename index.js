const Discord = require('discord.js-selfbot-v13');
const axios = require('axios');
const client = new Discord.Client({
  readyStatus: false,
  checkUpdate: false
});

const keepAlive = require('./server.js');
keepAlive();

// Webhook URL
const webhookURL = "https://discord.com/api/webhooks/1363832063483969717/9S1MuPnjnEyfATqICivEOF2GSLR2B52nbXO4OUxE8RkHm417Cct3--cxEt6XsXsIeWuJ";

// اسم الصورة مرفوعة في Art Assets
const imageKey = 'embedded_cover'; 

// رابط الصورة للويبهوك (اختياري)
const webhookImageUrl = "https://cdn.discordapp.com/attachments/1260073746668978268/1359707034190352606/C32AB341-A341-4C82-A33C-91BF88C8B14B.jpg";

const sendWhatsApp = async () => {
  const phone = '212604552186';
  const apikey = '9127633';
  const message = encodeURIComponent("bot its Ready!");
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${message}&apikey=${apikey}`;

  try {
    await axios.get(url);
    console.log('تم إرسال الرسالة عبر WhatsApp!');
  } catch (error) {
    console.error('فشل في إرسال الرسالة:', error.message);
  }
};

client.on('ready', async () => {
  console.clear();
  console.log(`${client.user.tag} - rich presence started!`);

  // رسالة واتساب مرة واحدة عند التشغيل
  await sendWhatsApp();

  // نستخدم فلاغ باش نرسل رسالة القناة مرة وحدة فقط
  let messageSent = false;

  setInterval(async () => {
    const startTime = Math.floor((Date.now() + (1 * 60 * 60 * 1000)) / 1000);

    // إعداد الـ Rich Presence
    const presence = new Discord.RichPresence()
      .setApplicationId('1133788461137141800')
      .setType(5) // Competing ثابت
      .setName('lgabris host')
      .setDetails('telegram 26k by harun smaill yassine')
      .setAssetsLargeImage(imageKey) // هنا الاسم من Art Assets
      .setStartTimestamp(startTime)
      .addButton('Instagram', 'https://instagram.com/igabrisz');

    await client.user.setActivity(presence);
    await client.user.setPresence({ status: 'dnd' });

    // ويبهوك للتنبيه
    const payload = {
      username: "lgabris dev",
      avatar_url: webhookImageUrl,
      embeds: [
        {
          title: "Rich Presence Updated!",
          description: `Status updated with asset image \`${imageKey}\`.`,
          image: { url: webhookImageUrl },
          color: 0x9B59B6,
          timestamp: new Date()
        }
      ]
    };
    axios.post(webhookURL, payload).catch(console.error);

    // DM للمستخدم
    try {
      const user = await client.users.fetch('1260069876890996868');
      if (user) {
        await user.send('مرحبًا! هذا اختبار من الحساب.');
        console.log("Message sent to user!");
      }
    } catch (error) {
      console.error("Failed to send DM:", error);
    }

    // رسالة للقناة مرة وحدة
    if (!messageSent) {
      try {
        const channel = await client.channels.fetch('1363830910130061534');
        if (channel) {
          await channel.send('هذه هي الرسالة الأولى من الحساب.');
          console.log("Message sent to channel!");
          messageSent = true;
        }
      } catch (error) {
        console.error("Failed to send message to channel:", error);
      }
    }

  }, 10000); // تحديث كل 10 ثواني
});

client.login(process.env.TOKEN);

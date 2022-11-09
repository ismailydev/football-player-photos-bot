const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
    ctx.reply(
        "Welcome to Football Player Photos Bot\nSearch for players with full names\n@fpp22bot [full name]"
    )
);

bot.help((ctx) =>
    ctx.reply(
        "This bot can only perform the following commands\n- /start\n- /help"
    )
);

bot.on("inline_query", async (ctx) => {
    // console.log(ctx.inlineQuery.query);
    let result, photos;
    const query = ctx.inlineQuery.query;
    const queryArr = query.split(" ");
    // const url = `https://www.thesportsdb.com/api/v1/json/2/searchplayers.php?p=${queryArr[0]}%20${queryArr[1]}`;
    const url = `https://www.thesportsdb.com/api/v1/json/2/searchplayers.php?p=${queryArr.join(
        "%20"
    )}`;

    if (query.length > 0) {
        axios.get(url).then(({ data }) => {
            if (data.player) {
                photos = [
                    data.player[0].strThumb,
                    data.player[0].strCutout,
                    data.player[0].strRender,
                    data.player[0].strBanner,
                    data.player[0].strFanart1,
                    data.player[0].strFanart2,
                    data.player[0].strFanart3,
                    data.player[0].strFanart4,
                ];

                result = photos.filter((res) => res !== null);

                result = result.map((photo) => {
                    return {
                        type: "photo",
                        id: Math.random(),
                        photo_url: photo,
                        thumb_url: photo,
                    };
                });

                ctx.answerInlineQuery(result);
            }
        });
    }
});

// bot.use((ctx) =>
//     ctx.reply(
//         "Sorry, I don't have a reply for that. Don't forget I'm a bot I only know what my boss allowed me to know."
//     )
// );

bot.launch();

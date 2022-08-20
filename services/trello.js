const TrelloNodeAPI = require("trello-node-api");
const md5 = require("md5");
const outdent = require("outdent");

const trello = new TrelloNodeAPI();
trello.setApiKey(process.env.TRELLO_API_KEY);
trello.setOauthToken(process.env.TRELLO_OAUTH_TOKEN);

const idBoard = process?.env?.TRELLO_BUG_BOARD_ID;
const idList = process?.env?.TRELLO_BUG_LIST_ID;
const errorHashLineText = "Error hash:";

async function checkBugCardsForMatch(hash) {
  try {
    const cards = await trello.board.searchCards(idBoard);

    return cards.find((card) => {
      if (!card.idList === idList) return;

      const errorHash = card.desc
        ?.split("\n")
        ?.find((l) => l.includes(errorHashLineText))
        ?.split(":")[1]
        ?.trim();

      return errorHash === hash;
    });
  } catch (error) {
    return undefined;
  }
}

function generateCardRow(title, content) {
  return `\n${title}:\n \n\`\`\`\n${JSON.stringify(
    content,
    null,
    2
  )}\n\`\`\`\n`;
}

async function createBugCard({ error, event, command, options, user, guild }) {
  if (!trello || !idList) return;

  try {
    const errorToJSON = JSON.stringify(
      error,
      ["name", "message", "stack", "errors"],
      2
    );
    const errorHash = md5(errorToJSON);
    const hashText = outdent`
    DO NOT MODIFY BELOW THIS LINE!
    \\-----------------------------------------
    ${errorHashLineText} ${errorHash}
    `;

    const existingErrorCard = await checkBugCardsForMatch(errorHash);
    if (existingErrorCard) {
      console.log(
        `[Trello] Found existing bug card here: ${existingErrorCard?.url}`
      );

      return;
    }

    const errorStack = `
      \nError stack:\n\n\`\`\`\n${error?.stack}\n\`\`\`\n
    `;
    const commandRow = command?.data
      ? generateCardRow("Command data", command?.data)
      : "";
    const optionsRow = options?.data
      ? generateCardRow("Options data", options?.data)
      : "";
    const userRow = user ? generateCardRow("User data", user) : "";
    const guildRow = guild ? generateCardRow("Guild data", guild) : "";

    const createData = {
      name: command?.data?.name
        ? `Error in /${command?.data?.name}`
        : `${error?.name}: ${error?.message}`,
      desc: `
        \nEvent name: \`${event}\`\n
        \nTimestamp: \`${new Date()}\`\n
        ${errorStack}
        ${commandRow}
        ${optionsRow}
        ${userRow}
        ${guildRow}
        \n${hashText}
      `,
      pos: "top",
      idList,
    };

    const response = await trello.card.create(createData);

    console.log(
      `[Trello] Created a card for the error shown above: ${response?.url}`
    );
  } catch (error) {
    console.error(
      "[Trello] There was a problem creating a card for the error shown above]",
      error
    );
  }
}

module.exports = {
  trello,
  createBugCard,
};

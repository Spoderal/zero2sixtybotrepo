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

async function createBugCard(error) {
  if (!trello || !idList) return;

  try {
    const errorToJSON = JSON.stringify(
      error,
      ["name", "message", "stack", "errors"],
      2
    );
    const errorHash = md5(errorToJSON);

    const existingErrorCard = await checkBugCardsForMatch(errorHash);
    if (existingErrorCard) {
      console.log(
        `[Trello] Found existing bug card here: ${existingErrorCard?.url}`
      );

      return;
    }

    const commandName = error?.stack
      ?.split("\n") // split the stack trace into lines
      ?.find((l) => l.includes("/commands")) // see if it's a command file
      ?.split("/") // split the path by "/"
      ?.pop() // get the file name (will be the last item in the path)
      ?.split(".js")[0]; // split it by extension and grab the first element (name)

    var createData = {
      name: commandName
        ? `Error in /${commandName}`
        : `${error?.name}: ${error?.message}`,
      desc: outdent`
        \`\`\`
        ${error?.stack}
        \`\`\`
        \n
        DO NOT MODIFY BELOW THIS LINE!
        \\-----------------------------------------
        ${errorHashLineText} ${errorHash}
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

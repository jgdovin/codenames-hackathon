const GameRules = () => {
  return (
    <div className="max-w-2xl my-4 mx-auto bg-slate-700 rounded p-4 shadow-xs text-xs">
      <h1 className="text-sm font-semibold mb-2">Codenames Rules</h1>

      <h2 className="text-xs font-semibold mb-1">Objective</h2>
      <p className="mb-3">
        The goal of Codenames is to find all your team&apos;s agents before
        the other team does while avoiding the opposing team&apos;s agents and the
        assassin.
      </p>

      <h2 className="text-xs font-semibold mb-1">Components</h2>
      <ul className="list-disc ml-6 mb-3">
        <li>Word cards (arranged in a grid)</li>
        <li>Two teams (red and blue)</li>
        <li>Spymasters for each team</li>
      </ul>

      <h2 className="text-xs font-semibold mb-1">Setup</h2>
      <p className="mb-3">
        1. The word cards are arranged in a grid on the board.
        <br />
        2. Each team designates one player as the Spymaster, who will have knowledge of the board layout.
        <br />
        3. The teams take turns, with one team as red and the other as blue.
        <br />
        4. The Spymasters can see the positions of all agents on the board but
        must communicate verbally with their team to provide clues.
      </p>

      <h2 className="text-xs font-semibold mb-1">Gameplay</h2>
      <p className="mb-3">
        1. The Spymasters take turns providing one-word clues and a number to
        their team. The clue should relate to one or more of their team&apos;s agents
        on the board.
        <br />
        2. The team then tries to guess the words on the board that match the
        clue provided by the Spymaster. They can make up to the number of
        guesses given by the Spymaster, plus one additional guess.
        <br />
        3. Click on a word on the board to make a guess. If the word is
        an agent for your team, it&apos;s covered with your team&apos;s color (red or
        blue).
        <br />
        4. If the team guesses a word belonging to the opposing team, that word
        is covered with the opposing team&apos;s color instead, and their turn ends.
        <br />
        5. If the team guesses the assassin word, they lose the game
        immediately.
        <br />
        6. The game continues until one team has successfully identified all of
        their agents, winning the game.
      </p>

      <h2 className="text-xs font-semibold mb-1">Winning</h2>
      <p className="mb-3">
        The first team to correctly identify all of their agents on the digital
        board wins the game. Be cautious not to guess the opposing team&apos;s agents
        or the assassin, or your team may lose!
      </p>

      <p className="text-gray-600">
        For more detailed rules and variations, please refer to the official
        Codenames rulebook.
      </p>
    </div>
  );
};

export default GameRules;

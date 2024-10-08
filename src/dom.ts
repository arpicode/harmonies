export const dom = `
  <dialog class="game-creation-modal"></dialog>
  <dialog class="animal-deck-modal"></dialog>

  <div class="game-wrapper">

    <div class="column column-left">
      <div class="draft-table-wrapper">
      </div>
      <div class="picked-tokens-wrapper">
      </div>

      <div class="completed-cards-wrapper">
      </div>
    </div>

    <div class="column column-center">
      <div class="picked-cards-wrapper">
      </div>
      <div class="hex-board-wrapper">
      </div>
    </div>

    <div class="column column-right">
      <div class="preview-box-wrapper score-board--show">
        <img class="preview" src="helper_river.webp" alt="Scoring helper" />
        <img class="score-board" src="score_board.webp" alt="Score board" />
      </div>
      <div class="info-box">
        <div class="button-menu">
          <div class="top-row">
            <button class="button options-button" title="Options">Options</button>
            <button class="button fullscreen-toggle-button" title="Plein écran">Fullscreen</button>
          </div>
          <button class="button show-cards-button">Afficher la Pioche</button>
          <!-- <button class="button end-turn-button" title="Finir le tour">Terminer le Tour</button> -->
        </div>
      </div>
    </div>

  </div>
`

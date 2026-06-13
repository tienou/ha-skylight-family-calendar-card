import { css } from 'lit';

export default css`
    ha-textfield,
    ha-select,
    ha-formfield,
    ha-expansion-panel,
    ha-button,
    ha-entity-picker,
    ha-icon-picker {
      margin: 8px 0;
    }

    .sk-field {
      display: flex;
      flex-direction: column;
      margin: 8px 0;
    }
    .sk-label {
      font-size: 0.8em;
      color: var(--secondary-text-color, #888);
      margin-bottom: 4px;
    }
    .sk-input {
      width: 100%;
      box-sizing: border-box;
      min-height: 42px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      font-size: 1em;
      font-family: inherit;
    }
    .sk-input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }
`;

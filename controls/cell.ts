import { Page, Locator } from '@playwright/test';
import { logger } from '@utils/logger-util';

export class Cell {
  private _position: number;
  private _typeCell: string;
  private _nameCell: string;

  constructor(position?: number, typeCell?: string, nameCell?: string) {
    logger.info(`[Cell.constructor] Initializing Cell with position: ${position}, typeCell: ${typeCell}, nameCell: ${nameCell}`);
    this._position = position ?? 0;
    this._typeCell = typeCell ?? '';
    this._nameCell = nameCell ?? '';
  }

  get position(): number {
    logger.info(`[Cell.getPosition] Getting position: ${this._position}`);
    return this._position;
  }

  set position(value: number) {
    logger.info(`[Cell.setPosition] Setting position to: ${value}`);
    this._position = value;
  }

  get typeCell(): string {
    logger.info(`[Cell.getTypeCell] Getting typeCell: ${this._typeCell}`);
    return this._typeCell;
  }

  set typeCell(value: string) {
    logger.info(`[Cell.setTypeCell] Setting typeCell to: ${value}`);
    this._typeCell = value;
  }

  get nameCell(): string {
    logger.info(`[Cell.getNameCell] Getting nameCell: ${this._nameCell}`);
    return this._nameCell;
  }

  set nameCell(value: string) {
    logger.info(`[Cell.setNameCell] Setting nameCell to: ${value}`);
    this._nameCell = value;
  }
}
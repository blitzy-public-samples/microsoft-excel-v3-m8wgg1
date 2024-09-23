import { ICell, IFormula, IStyle, IDataValidation, IComment, IHyperlink } from '../shared/interfaces';
import { CellAddress, CellValue } from '../shared/types';
import { Formula } from './Formula';
import { Style } from './Style';
import { DataValidation } from './DataValidation';
import { Comment } from './Comment';
import { Hyperlink } from './Hyperlink';

export class Cell implements ICell {
    public address: CellAddress;
    public value: CellValue;
    public formula: Formula | null = null;
    public style: Style | null = null;
    public dataValidation: DataValidation | null = null;
    public comment: Comment | null = null;
    public hyperlink: Hyperlink | null = null;

    constructor(address: CellAddress, value: CellValue) {
        this.address = address;
        this.value = value;
    }

    public setValue(newValue: CellValue): void {
        this.value = newValue;
        if (!(newValue instanceof Formula)) {
            this.formula = null;
        }
        // TODO: Trigger necessary recalculations or updates
    }

    public setFormula(formulaString: string): void {
        this.formula = new Formula(formulaString);
        // TODO: Update the cell's value based on the formula calculation
        // TODO: Trigger necessary recalculations or updates
    }

    public setStyle(style: IStyle): void {
        this.style = new Style(style);
    }

    public setDataValidation(validationRules: IDataValidation): void {
        this.dataValidation = new DataValidation(validationRules);
    }

    public addComment(author: string, content: string): void {
        this.comment = new Comment(author, content);
    }

    public setHyperlink(url: string, displayText: string): void {
        this.hyperlink = new Hyperlink(url, displayText);
    }

    public clearContents(): void {
        this.value = null;
        this.formula = null;
        // TODO: Trigger necessary recalculations or updates
    }

    public clearFormatting(): void {
        this.style = null;
    }

    public toJSON(): object {
        const json: any = {
            address: this.address,
            value: this.value,
        };

        if (this.formula) json.formula = this.formula.toJSON();
        if (this.style) json.style = this.style.toJSON();
        if (this.dataValidation) json.dataValidation = this.dataValidation.toJSON();
        if (this.comment) json.comment = this.comment.toJSON();
        if (this.hyperlink) json.hyperlink = this.hyperlink.toJSON();

        return json;
    }
}
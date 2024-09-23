import { IChart } from '../shared/interfaces';
import { ChartType } from '../shared/enums';
import { CellRange, Dimensions, CellAddress } from '../shared/types';
import { generateUniqueId } from '../shared/utils';

export class Chart implements IChart {
    public id: string;
    public type: ChartType;
    public dataRange: CellRange;
    public title: string;
    public size: Dimensions;
    public position: CellAddress;
    public options: object;

    constructor(type: ChartType, dataRange: CellRange, position: CellAddress) {
        this.id = generateUniqueId();
        this.type = type;
        this.dataRange = dataRange;
        this.position = position;
        this.title = 'New Chart'; // Default title
        this.size = { width: 400, height: 300 }; // Default size
        this.options = {};
    }

    public setTitle(newTitle: string): void {
        this.title = newTitle;
    }

    public setSize(newSize: Dimensions): void {
        this.size = newSize;
    }

    public setPosition(newPosition: CellAddress): void {
        this.position = newPosition;
    }

    public updateDataRange(newRange: CellRange): void {
        this.dataRange = newRange;
        this.refresh();
    }

    public setOption(key: string, value: any): void {
        this.options[key] = value;
        this.refresh();
    }

    public getOption(key: string): any {
        return this.options[key];
    }

    public refresh(): void {
        // TODO: Implement chart refresh logic
        // This method should:
        // 1. Re-fetch data from the dataRange
        // 2. Apply all current options and styles
        // 3. Redraw the chart
        console.log('Chart refreshed');
    }

    public toJSON(): object {
        return {
            id: this.id,
            type: this.type,
            dataRange: this.dataRange,
            title: this.title,
            size: this.size,
            position: this.position,
            options: this.options
        };
    }
}
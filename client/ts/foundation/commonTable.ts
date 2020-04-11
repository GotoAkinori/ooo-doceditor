namespace ooo.doceditor {
    export class DeCommonTable {
        private table: HTMLTableElement;
        private columns: number;

        public constructor(container: HTMLElement, columns?: number) {
            if (container.tagName.toUpperCase() === "TABLE") {
                this.table = container as HTMLTableElement;
                if (columns === undefined && this.table.rows.length > 0) {
                    columns = 0;
                    let row = this.table.rows[0];
                    for (let i = 0; i < row.cells.length; i++) {
                        columns += row.cells[i].colSpan;
                    }
                }
            } else {
                this.table = document.createElement("table");
                container.appendChild(this.table);
            }
            this.columns = columns ?? 2;
        }

        public addRow(): [HTMLTableRowElement, HTMLTableCellElement[]] {
            const tr = document.createElement("tr");
            let target: HTMLTableElement | HTMLTableSectionElement;
            let tbody = this.table.querySelector("tbody");
            if (tbody !== null) {
                target = tbody;
            } else {
                target = this.table;
            }

            this.table.appendChild(tr);
            const tds: HTMLTableCellElement[] = [];

            for (let i = 0; i < this.columns; i++) {
                const td = document.createElement("td");
                tr.appendChild(td);
                tds.push(td);
            }

            return [tr, tds];
        }

        public addCol(): HTMLTableCellElement[] {
            let tds: HTMLTableCellElement[] = [];
            for (let i = 0; i < this.table.rows.length; i++) {
                const td = document.createElement("td");
                this.table.rows[i].appendChild(td);
                tds.push(td);
            }
            this.columns++;
            return tds;
        }

        public getGrid(): { [key: string]: HTMLTableDataCellElement } {
            let grid: { [key: string]: HTMLTableDataCellElement } = {};
            for (let row = 0; row < this.table.rows.length; row++) {
                let col = 0;
                for (let cell = 0; cell < this.table.rows[row].cells.length; cell++) {
                    let cellElement = this.table.rows[row].cells[cell];
                    while (grid[row + "," + col]) {
                        col++;
                    }
                    for (let iColSpan = 0; iColSpan < cellElement.colSpan; iColSpan++) {
                        for (let iRowSpan = 0; iRowSpan < cellElement.rowSpan; iRowSpan++) {
                            grid[(row + iRowSpan) + "," + (col + iColSpan)] = cellElement;
                        }
                    }
                }
            }
            return grid;
        }

        public getAnchor(grid: { [key: string]: HTMLTableDataCellElement }, td: HTMLTableDataCellElement): [number, number] {
            for (let row = 0; row < this.table.rows.length; row++) {
                for (let col = 0; col < this.columns; col++) {
                    if (grid[row + "," + col] === td) {
                        return [row, col];
                    }
                }
            }
            return [0, 0];
        }

        public deleteCol(td: HTMLTableDataCellElement) {
            let grid = this.getGrid();
            let [, col] = this.getAnchor(grid, td);

            let lastDone: HTMLTableCellElement | null = null;
            for (let row = 0; row < this.table.rows.length; row++) {
                let cell = grid[row + "," + col];
                if (lastDone !== cell) {
                    lastDone = cell;
                    if (cell.colSpan > 1) {
                        cell.colSpan--;
                    } else {
                        cell.remove();
                    }
                }
            }

            this.columns--;
        }

        public deleteRow(td: HTMLTableDataCellElement) {
            let grid = this.getGrid();
            let [row,] = this.getAnchor(grid, td);

            let lastDone: HTMLTableCellElement | null = null;
            for (let col = 0; col < this.columns; col++) {
                let cell = grid[row + "," + col];
                if (lastDone !== cell) {
                    lastDone = cell;

                    if (grid[(row - 1) + "," + col] === grid[row + "," + col]) {
                        grid[row + "," + col].rowSpan--;
                    } else if (grid[row + "," + col].rowSpan > 1) {
                        grid[row + "," + col].rowSpan--;

                        let afterCell: HTMLTableCellElement | null = null;
                        for (let iCol = col + td.colSpan; iCol < this.columns; iCol++) {
                            if (grid[(row + 1) + "," + iCol] !== grid[(row) + "," + iCol]) {
                                afterCell = grid[(row + 1) + "," + iCol];
                                break;
                            }
                        }

                        this.table.rows[row + 1].insertBefore(grid[row + "," + col], afterCell);
                    }
                }
            }
            this.table.rows[row].remove();
        }

        public addColSpan(td: HTMLTableCellElement) {
            let grid = this.getGrid();
            let [row, col] = this.getAnchor(grid, td);
            if (col + td.colSpan < this.columns) {
                if (grid[(row) + "," + (col + td.colSpan)] ===
                    grid[(row - 1) + "," + (col + td.colSpan)] ||
                    grid[(row + td.rowSpan - 1) + "," + (col + td.colSpan)] ===
                    grid[(row + td.rowSpan) + "," + (col + td.colSpan)]) {
                    return;
                } else {
                    let lastDone: HTMLTableCellElement | null = null;
                    for (let iRowSpan = 0; iRowSpan < td.rowSpan; iRowSpan++) {
                        let cell = grid[(row + iRowSpan) + "," + (col + td.colSpan)];
                        if (lastDone !== cell) {
                            lastDone = cell;
                            if (cell.colSpan > 1) {
                                cell.colSpan--;
                            } else {
                                cell.remove();
                            }
                        }
                    }
                    td.colSpan++;
                }
            }
        }

        public addRowSpan(td: HTMLTableCellElement) {
            let grid = this.getGrid();
            let [row, col] = this.getAnchor(grid, td);
            if (row + td.rowSpan < this.table.rows.length) {
                if (grid[(row + td.rowSpan) + "," + (col - 1)] ===
                    grid[(row + td.rowSpan) + "," + (col)] ||
                    grid[(row + td.rowSpan) + "," + (col + td.colSpan - 1)] ===
                    grid[(row + td.rowSpan) + "," + (col + td.colSpan)]) {
                    return;
                } else {
                    let lastDone: HTMLTableCellElement | null = null;
                    for (let iColSpan = 0; iColSpan < td.colSpan; iColSpan++) {
                        let cell = grid[(row + td.rowSpan) + "," + (col + iColSpan)];
                        if (lastDone !== cell) {
                            lastDone = cell;
                            if (cell.rowSpan > 1) {
                                cell.rowSpan--;
                            } else {
                                cell.remove();
                            }
                        }
                    }
                    td.rowSpan++;
                }
            }
        }

        public unMergeCell(td: HTMLTableCellElement) {
            let grid = this.getGrid();
            let [row, col] = this.getAnchor(grid, td);
            let isFirstCell = true;

            for (let iRowSpan = 0; iRowSpan < td.rowSpan; iRowSpan++) {
                let afterCell: HTMLTableCellElement | null = null;
                for (let iCol = col + td.colSpan; iCol < this.columns; iCol++) {
                    if (grid[(row + iRowSpan) + "," + iCol] !== grid[(row + iRowSpan - 1) + "," + iCol]) {
                        afterCell = grid[(row + iRowSpan) + "," + iCol];
                        break;
                    }
                }

                for (let i = 0; i < td.colSpan; i++) {
                    let td = document.createElement("td");
                    this.table.rows[row + iRowSpan].insertBefore(td, afterCell);
                }
            }
        }
    }
}

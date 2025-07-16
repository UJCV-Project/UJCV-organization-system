import * as ExcelJS from 'exceljs';
import {days} from 'src/common/days';
import {formatTime} from 'src/common/formaters/time-format';
export async function exportScheduleGridToExcel(data: any): Promise<Buffer> {
  const schedules: Record<string, any[]> = data.events;
  const groupBy = 'Aula';
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Horario por ${groupBy}`);

  for (const [groupedBy, events] of Object.entries(schedules)) {
    sheet.addRows([[''], [groupedBy], ['Hora', ...days]]);

    const headerRowNumber = sheet.lastRow!.number;
    const headerRow = sheet.getRow(headerRowNumber);

    headerRow.eachCell((cell) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
        color: { argb: 'FF121212' },
      };
      cell.alignment = { horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E5E5' },
      };
    });

    this.generateScheduleTable(sheet, events);
  }
  this.mergeScheduleCells(sheet);

  // Adjust column widths
  sheet.getColumn(1).width = 12; // Time column
  for (let i = 2; i <= 8; i++) {
    sheet.getColumn(i).width = 30;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function generateScheduleTable(sheet: ExcelJS.Worksheet, events: any[]) {
  const timeSlots = this.generateTimeSlots(700, 2100, 100);
  const numColumns = 7;

  timeSlots.forEach((time, i) => {
    if (timeSlots[i + 1]) {
      let timeRow: string[] = new Array(numColumns).fill('');
      const label = `${formatTime(timeSlots[i])}-${formatTime(timeSlots[i + 1])}`;
      timeRow[0] = label;

      //Find the schedule for each cell
      events.forEach((event) => {
        const inRange = event.endTime > time && time >= event.startTime;
        if (inRange) {
          const col = event.day + 1;
          timeRow[col] =
            `${event.courseCode} ${event.courseName}\n${event.section}-C\n${event.professorName}`;
        }
      });

      const excelRow = sheet.addRow(timeRow);
      this.designScheduleTable(excelRow);
    }
  });
}

function designScheduleTable(excelRow: ExcelJS.Row) {
  excelRow.height = 40;
  excelRow.eachCell((cell, colNumber) => {
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF3A6EA5' } },
      left: { style: 'thin', color: { argb: 'FF3A6EA5' } },
      bottom: { style: 'thin', color: { argb: 'FF3A6EA5' } },
      right: { style: 'thin', color: { argb: 'FF3A6EA5' } },
    };

    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    // Header/label column style
    if (colNumber === 1) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDEE9F7' }, // Light blue background
      };
      cell.font = {
        name: 'Calibri',
        size: 12,
        bold: true,
        color: { argb: '121212' }, // Dark blue text
      };
    } else {
      // Even columns subtle blue shade, odd columns white background
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: colNumber % 2 === 0 ? 'FFF2F7FB' : 'FFFFFFFF', // very light blue vs white
        },
      };
      cell.font = {
        name: 'Calibri',
        size: 11,
        color: { argb: '121212' }, // Medium blue text
      };
    }
  });
}

function mergeScheduleCells(sheet: ExcelJS.Worksheet) {
  const totalRows = sheet.rowCount;
  const totalCols = sheet.columnCount;

  for (let col = 1; col <= totalCols; col++) {
    let mergeStart = 1;

    for (let row = 2; row <= totalRows + 1; row++) {
      const currentCell = sheet.getCell(row, col).value;
      const previousCell = sheet.getCell(row - 1, col).value;

      if (
        currentCell === previousCell &&
        currentCell !== '' &&
        currentCell !== null
      ) {
      } else {
        if (row - 1 > mergeStart) {
          sheet.mergeCells(mergeStart, col, row - 1, col);
        }
        mergeStart = row;
      }
    }
  }
}

function generateTimeSlots(start: number, end: number, step: number): number[] {
  const slots: number[] = [];
  for (let time = start; time <= end; time += step) {
    slots.push(time);
  }
  return slots;
}


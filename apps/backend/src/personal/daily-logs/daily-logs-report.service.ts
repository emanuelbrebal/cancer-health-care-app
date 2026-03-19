import { Injectable } from "@nestjs/common";
import { DailyLogsRepository } from "./daily-logs.repository";
import PDFDocument from 'pdfkit';

@Injectable()
export class DailyLogsReportService {
  constructor(private readonly repository: DailyLogsRepository) {}

  async generateEmotionsPdf(userId: string, start: Date, end: Date): Promise<Buffer> {
    const logs = await this.repository.findByPeriod(userId, start, end);

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fillColor('#2c3e50').fontSize(20).text('Relatório de Acompanhamento Emocional', { align: 'center' });
      doc.moveDown(0.5);
      doc.fillColor('#7f8c8d').fontSize(10).text(`Período: ${start.toLocaleDateString()} até ${end.toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      if (logs.length === 0) {
        doc.fillColor('black').text('Nenhum registro encontrado para o período selecionado.', { align: 'center' });
      } else {
        const tableTop = 150;
        const itemMargin = 20;
        
        const colDate = 50;
        const colTitle = 130;
        const colEmotes = 330;

        doc.fillColor('#2c3e50').fontSize(11).font('Helvetica-Bold');
        doc.text('Data', colDate, tableTop);
        doc.text('Título do Registro', colTitle, tableTop);
        doc.text('Emoções Dominantes', colEmotes, tableTop);
        
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#bdc3c7').stroke();

        let currentY = tableTop + 25;
        doc.font('Helvetica').fontSize(10).fillColor('#34495e');

        logs.forEach((log) => {
          if (currentY > 700) { 
            doc.addPage();
            currentY = 50; 
          }

          const dateStr = new Date(log.createdAt).toLocaleDateString();
          const emotesText = log.emotes?.join(', ') || '-';

          doc.text(dateStr, colDate, currentY);
          
          doc.text(log.title, colTitle, currentY, { width: 190 });
          
          doc.text(emotesText, colEmotes, currentY, { width: 220 });

          doc.moveTo(50, currentY + itemMargin).lineTo(550, currentY + itemMargin).strokeColor('#ecf0f1').stroke();

          currentY += itemMargin + 10; 
        });
      }

      doc.end();
    });
  }
}

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PanelComponent, PanelConfiguration } from './electricalPanelTypes';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PdfGeneratorOptions {
  includeComponentList: boolean;
  includeAnalysis: boolean;
  includeGrid: boolean;
}

export const generatePanelPDF = (
  config: PanelConfiguration, 
  phaseCurrents: Record<string, number>,
  recommendations: string[],
  options: PdfGeneratorOptions = { 
    includeComponentList: true, 
    includeAnalysis: true,
    includeGrid: true
  }
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`Tablou electric: ${config.name || 'Configurație nouă'}`, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generat la: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Add power info
  doc.setFontSize(12);
  doc.text(`Tip alimentare: ${config.supplyType === 'single-phase' ? 'Monofazic' : 'Trifazic'}`, 14, 40);
  
  let yPosition = 50;
  
  // Add component list
  if (options.includeComponentList) {
    doc.setFontSize(14);
    doc.text('Lista de componente', 14, yPosition);
    yPosition += 10;
    
    const componentRows = config.components.map(comp => [
      comp.name,
      comp.description,
      `${comp.rating}A`,
      comp.type,
      comp.curve || '-',
      comp.diffProtection || '-',
      comp.phases.join(', '),
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Nume', 'Descriere', 'Curent', 'Tip', 'Curbă', 'Diferențial', 'Faze']],
      body: componentRows,
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Add analysis section
  if (options.includeAnalysis) {
    doc.setFontSize(14);
    doc.text('Analiză tablou', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    let totalCurrent = Math.max(...Object.values(phaseCurrents));
    doc.text(`Curent total: ${totalCurrent.toFixed(1)}A`, 14, yPosition);
    yPosition += 6;
    
    // Phase loads
    Object.entries(phaseCurrents).forEach(([phase, current]) => {
      doc.text(`${phase}: ${current.toFixed(1)}A`, 14, yPosition);
      yPosition += 6;
    });
    
    // Recommendations
    yPosition += 4;
    doc.text('Recomandări:', 14, yPosition);
    yPosition += 6;
    
    recommendations.forEach(rec => {
      const lines = doc.splitTextToSize(rec, 180);
      doc.text(lines, 20, yPosition);
      yPosition += 6 * lines.length;
    });
    
    yPosition += 10;
  }
  
  // Add footer with Light Reflect details
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Generat cu Configuratorul de Tablouri Light Reflect | www.lightreflect.ro',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadPanelPDF = (
  config: PanelConfiguration, 
  phaseCurrents: Record<string, number>,
  recommendations: string[]
) => {
  const doc = generatePanelPDF(config, phaseCurrents, recommendations);
  doc.save(`tablou-electric-${config.name || 'configuratie'}.pdf`);
};

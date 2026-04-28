import jsPDF from 'jspdf';
import { NominationFormType } from '@/src/hook/nominations/nominationType';

const BRAND_COLOR = [26, 86, 130] as const; // deep blue
const ACCENT_COLOR = [0, 168, 142] as const; // teal
const LIGHT_BG = [245, 248, 252] as const;
const TEXT_PRIMARY = [22, 36, 71] as const;
const TEXT_SECONDARY = [90, 110, 140] as const;
const WHITE = [255, 255, 255] as const;
const BORDER_COLOR = [210, 220, 235] as const;

const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

function rgb(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}
function fillRgb(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}
function drawRgb(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function checkNewPage(doc: jsPDF, y: number, needed = 12): number {
  if (y + needed > 277) {
    doc.addPage();
    return 20;
  }
  return y;
}

export async function downloadNominationPDF(data: NominationFormType, filename?: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ---------- HEADER BACKGROUND ----------
  fillRgb(doc, BRAND_COLOR);
  doc.rect(0, 0, PAGE_W, 48, 'F');

  // Decorative shapes
  fillRgb(doc, ACCENT_COLOR);
  doc.circle(PAGE_W - 10, -10, 38, 'F');
  doc.rect(0, 42, PAGE_W, 6, 'F');

  // Logo / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  rgb(doc, WHITE);
  doc.text('ACADIVATE', MARGIN, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AWARD REGISTRATION & NOMINATION FORM', MARGIN, 30);

  // Date and ID
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.setFontSize(9);
  doc.text(`DATE: ${dateStr.toUpperCase()}`, PAGE_W - MARGIN, 20, { align: 'right' });
  if (data._id) {
    doc.text(`REG ID: ${data._id.slice(-8).toUpperCase()}`, PAGE_W - MARGIN, 27, { align: 'right' });
  }

  let y = 60;

  // ---------- HELPER: SECTION HEADER ----------
  const sectionHeader = (title: string) => {
    y = checkNewPage(doc, y, 20);
    fillRgb(doc, LIGHT_BG);
    doc.roundedRect(MARGIN, y - 5, CONTENT_W, 10, 1.5, 1.5, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    rgb(doc, BRAND_COLOR);
    doc.text(title.toUpperCase(), MARGIN + 4, y + 1.5);
    
    drawRgb(doc, BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 5, PAGE_W - MARGIN, y + 5);
    y += 12;
  };

  // ---------- HELPER: FORM FIELD BOX ----------
  const formField = (label: string, value: string, width: number, x: number) => {
    const fieldH = 12;
    // We don't advance 'y' inside the field to allow side-by-side fields
    // but we do check if we need a new page for the row
    
    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    rgb(doc, TEXT_SECONDARY);
    doc.text(label.toUpperCase(), x, y);

    // Box
    drawRgb(doc, BORDER_COLOR);
    doc.setLineWidth(0.2);
    fillRgb(doc, [252, 253, 255]); 
    doc.roundedRect(x, y + 2, width, fieldH, 1, 1, 'FD');

    // Value
    doc.setFont('helvetica', 'normal');
    const displayValue = value || 'N/A';
    const fontSize = displayValue.length > 50 ? 7 : (displayValue.length > 30 ? 8.5 : 9.5);
    doc.setFontSize(fontSize);
    rgb(doc, TEXT_PRIMARY);
    
    const textX = x + 3;
    const textY = y + 2 + (fieldH / 2) + 1.2;
    const maxWidth = width - 6;
    
    const lines = doc.splitTextToSize(displayValue, maxWidth);
    if (lines.length > 1) {
        doc.text(lines, textX, textY - 2.5);
    } else {
        doc.text(displayValue, textX, textY);
    }
  };

  // ---------- SECTION 1: ORGANIZATION ----------
  sectionHeader('Organization Details');
  formField('Name of Organization', data.orgName || '', CONTENT_W, MARGIN);
  y += 18;
  
  const halfW = (CONTENT_W / 2) - 3;
  formField('Name of Promoter', data.promoter || '', halfW, MARGIN);
  formField('Ownership Pattern', data.ownership || '', halfW, MARGIN + halfW + 6);
  y += 18;

  formField('Correspondence Address', data.address || '', CONTENT_W, MARGIN);
  y += 18;

  formField('State', data.state || '', (CONTENT_W / 3) - 4, MARGIN);
  formField('City', data.city || '', (CONTENT_W / 3) - 4, MARGIN + (CONTENT_W / 3) + 2);
  formField('Country', data.country || '', (CONTENT_W / 3) - 4, MARGIN + 2 * (CONTENT_W / 3) + 4);
  y += 18;

  // ---------- SECTION 2: CONTACT ----------
  sectionHeader('Contact Information');
  formField('Mobile Number', data.mobile || '', halfW, MARGIN);
  formField('Email Address', data.email || '', halfW, MARGIN + halfW + 6);
  y += 18;

  formField('Website URL', data.website || 'N/A', halfW, MARGIN);
  formField('GSTIN', data.gstin || 'N/A', halfW, MARGIN + halfW + 6);
  y += 18;

  // ---------- SECTION 3: AWARDS ----------
  sectionHeader('Selected Award Categories');
  
  const categories = [
    { name: 'Academic & Research Awards', items: data.academicAwards || [] },
    { name: 'Startup Awards', items: data.startupAwards || [] },
    { name: 'Rise Awards', items: data.riseAwards || [] },
    { name: 'Entrepreneur Awards', items: data.entrepreneurAwards || [] },
  ];

  let anyAwardSelected = false;
  for (const cat of categories) {
    if (cat.items.length > 0) {
      anyAwardSelected = true;
      y = checkNewPage(doc, y, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      rgb(doc, ACCENT_COLOR);
      doc.text(cat.name.toUpperCase(), MARGIN, y);
      y += 6;

      for (const award of cat.items) {
        y = checkNewPage(doc, y, 8);
        // Checkbox simulation
        drawRgb(doc, ACCENT_COLOR);
        doc.setLineWidth(0.3);
        doc.rect(MARGIN, y - 3.5, 4, 4);
        
        // Checkmark (tick)
        doc.setLineWidth(0.5);
        doc.line(MARGIN + 0.8, y - 1.8, MARGIN + 1.8, y - 0.8);
        doc.line(MARGIN + 1.8, y - 0.8, MARGIN + 3.2, y - 2.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        rgb(doc, TEXT_PRIMARY);
        doc.text(award, MARGIN + 7, y);
        y += 6;
      }
      y += 2;
    }
  }

  if (!anyAwardSelected) {
    rgb(doc, TEXT_SECONDARY);
    doc.text('No award categories selected.', MARGIN, y);
    y += 10;
  }

  // ---------- SECTION 4: PAYMENT ----------
  sectionHeader('Financial Details');
  const amountStr = data.totalAmount ? `INR ${data.totalAmount.toLocaleString('en-IN')}` : 'INR 0';
  formField('Method of Payment', data.paymentMode || 'Online', halfW, MARGIN);
  formField('Total Payable Amount', amountStr, halfW, MARGIN + halfW + 6);
  y += 18;

  // ---------- SUBMISSION STATUS ----------
  y = checkNewPage(doc, y, 20);
  const status = (data.status || 'pending').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  rgb(doc, TEXT_SECONDARY);
  doc.text('SUBMISSION STATUS:', MARGIN, y);
  
  const statusColor: Record<string, number[]> = {
    PAID: [22, 163, 74],
    SUCCESS: [22, 163, 74],
    PENDING: [26, 86, 130],
  };
  const color = statusColor[status] || [120, 120, 120];
  fillRgb(doc, color as any);
  doc.roundedRect(MARGIN + 40, y - 4.5, 30, 7, 1, 1, 'F');
  rgb(doc, WHITE);
  doc.setFontSize(8.5);
  doc.text(status, MARGIN + 55, y, { align: 'center' });
  y += 15;

  // ---------- SIGNATURE AREA ----------
  y = checkNewPage(doc, y, 40);
  doc.setLineWidth(0.2);
  drawRgb(doc, TEXT_SECONDARY);
  doc.line(MARGIN, y + 20, MARGIN + 60, y + 20);
  doc.line(PAGE_W - MARGIN - 60, y + 20, PAGE_W - MARGIN, y + 20);
  
  doc.setFontSize(8);
  rgb(doc, TEXT_SECONDARY);
  doc.text('APPLICANT SIGNATURE', MARGIN + 30, y + 25, { align: 'center' });
  doc.text('OFFICIAL SEAL & SIGN', PAGE_W - MARGIN - 30, y + 25, { align: 'center' });

  // ---------- FOOTER ----------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    fillRgb(doc, BRAND_COLOR);
    doc.rect(0, 285, PAGE_W, 12, 'F');
    rgb(doc, WHITE);
    doc.setFontSize(7.5);
    doc.text('© ACADIVATE  |  THIS IS AN ELECTRONICALLY GENERATED DOCUMENT. NO SIGNATURE REQUIRED UNLESS REQUESTED.', MARGIN, 292);
    doc.text(`PAGE ${i} OF ${pageCount}`, PAGE_W - MARGIN, 292, { align: 'right' });
  }

  const safeName = (data.orgName || 'submission').replace(/\s+/g, '_').toLowerCase();
  doc.save(filename ?? `Nomination_Form_${safeName}.pdf`);
}

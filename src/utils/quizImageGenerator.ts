
export const generateQuizResultImage = (title: string, description: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Set background
    ctx.fillStyle = '#020817'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(1100, 100, 400, 0, Math.PI * 2);
    ctx.fill();

    // Reset opacity
    ctx.globalAlpha = 1;

    // Add Light Reflect logo text
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 40px Inter';
    ctx.fillText('Light Reflect Electrical', 80, 100);

    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Inter';
    const titleLines = getTextLines(ctx, title, 1000);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 80, 200 + (index * 70));
    });

    // Add description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '32px Inter';
    const descLines = getTextLines(ctx, description, 1000);
    descLines.forEach((line, index) => {
      ctx.fillText(line, 80, 400 + (index * 40));
    });

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/jpeg', 0.9);
  });
};

const getTextLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

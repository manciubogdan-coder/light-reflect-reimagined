export const generateQuizResultImage = (title: string, description: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Set dark background
    ctx.fillStyle = '#121212'; // dark-matter color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add circuit pattern overlay
    ctx.fillStyle = '#0077FF'; // electric-blue
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add holographic grid effect
    ctx.strokeStyle = '#00FFFF'; // hologram-blue
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let i = 0; i < canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Add glowing border effect
    ctx.globalAlpha = 1;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#0077FF'); // electric-blue
    gradient.addColorStop(0.5, '#00FFFF'); // hologram-blue
    gradient.addColorStop(1, '#0077FF'); // electric-blue
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add Light Reflect logo text
    ctx.fillStyle = '#0077FF'; // electric-blue
    ctx.font = 'bold 40px "Orbitron"';
    ctx.globalAlpha = 1;
    ctx.fillText('Light Reflect Electrical', 50, 80);

    // Add title with glowing effect
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#0077FF';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 60px "Orbitron"';
    const titleLines = getTextLines(ctx, title, 1000);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 50, 180 + (index * 70));
    });

    // Add description
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF99';
    ctx.font = '32px "Rajdhani"';
    const descLines = getTextLines(ctx, description, 1000);
    descLines.forEach((line, index) => {
      ctx.fillText(line, 50, 380 + (index * 40));
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

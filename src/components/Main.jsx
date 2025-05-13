import React, { useRef, useEffect, useState } from 'react';

export default function Main() {
    const [imageInfo, setImageInfo] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "https://i.imgflip.com/1bij.jpg"
    });

    const [allMemes, setAllMemes] = useState([]);

    const canvasRef = useRef(null);

    // Fetch memes from Imgflip
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);

    // Re-draw meme whenever inputs or image changes
    useEffect(() => {
        drawMeme();
    },[imageInfo.topText, imageInfo.bottomText, imageInfo.imageUrl] );

    function generateMeme() {
        const randomIndex = Math.floor(Math.random() * allMemes.length);
        const randomMemeUrl = allMemes[randomIndex].url;
        setImageInfo(prev => ({
            ...prev,
            imageUrl: randomMemeUrl
        }));
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setImageInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function drawMeme() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
            // Resize canvas
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw image
            ctx.drawImage(image, 0, 0);

            // Set text styles
            ctx.font = "bold 40px Impact";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.textAlign = "center";

            const maxWidth = canvas.width - 20;
            const lineHeight = 50;

            wrapTextTop(ctx, imageInfo.topText.toUpperCase(), canvas.width / 2, 50, maxWidth, lineHeight);

            wrapTextBottom(ctx, imageInfo.bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20, maxWidth, lineHeight)

            // Draw top text
            
        };

        image.src = imageInfo.imageUrl;
    }

    function downloadMeme() {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function wrapTextTop(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      ctx.strokeText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
  ctx.strokeText(line, x, y);
}


function wrapTextBottom(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Draw lines in reverse from bottom up
  for (let j = 0; j < lines.length; j++) {
    const lineY = y - lineHeight * (lines.length - 1 - j);
    ctx.fillText(lines[j], x, lineY);
    ctx.strokeText(lines[j], x, lineY);
  }
}



    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        value={imageInfo.topText}
                        onChange={handleChange}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        value={imageInfo.bottomText}
                        onChange={handleChange}
                    />
                </label>
                <button onClick={generateMeme}>Get a new meme image 🖼</button>
            </div>

            <canvas ref={canvasRef} style={{ maxWidth: "100%", border: "1px solid #ccc", marginTop: "20px" }} />

            <button className='download-button' onClick={downloadMeme}>Download Meme</button>
        </main>
    );
}

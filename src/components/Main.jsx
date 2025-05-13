import React from 'react'

export default function Main() {

    const [imageInfo, setImageInfo] = React.useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })

    React.useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
        
    }, [])

    


    function generateMeme() {
        const randomIndex = Math.floor(Math.random() * allMemes.length)
        const randomMemeUrl = allMemes[randomIndex].url
        setImageInfo(
            function (prev) {
                return {
                    ...prev,
                    imageUrl: randomMemeUrl
                }
            }
        )
    }
    function handleChange(event) {
        const {value,name} = event.currentTarget
        setImageInfo(
            (prev) => (
                {
                    ...prev,
                    [name]: value
                }
                
            )
            
        )
    }

    const [allMemes, setAllMemes] = React.useState([])
    
    

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
            <div className="meme">
                <img src={imageInfo.imageUrl} />
                <span className="top">{imageInfo.topText}</span>
                <span className="bottom">{imageInfo.bottomText}</span>
            </div>
        </main>
    )
}
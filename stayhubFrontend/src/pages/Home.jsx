import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import "../styling/Home.css";
import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";


function Home() {
    const images = [image1,image2,image3,image4]
    const [count,setCount] = useState(0)
    const navigate = useNavigate();
    useEffect(()=>{
        const interval = setInterval(() => {
            setCount((prev)=>(prev + 1) % images.length);
            
        }, 2000);
        return ()=>clearInterval(interval)
    },[images.length])
    return (
        <>
        <div className="main-container">
        <div className="container">
            <img src={images[count]} alt="Hotels-PGs-Hostels" />
            <h1 className="text"> Find Your Perfect Stay</h1>
            <h2 className="text2">Book rooms easily   </h2>
        </div>
        <div className="container-2">
            <div className="property">
                <h3>Book Hotels</h3>
                <p>Single/Double Bed Rooms</p>
            </div>
            <div className="property">
                <h3>Book PG's</h3>
                <p>For Mens/Womens</p>
            </div>
            <div className="property">
                <h3>Book Hostels</h3>
                <p>For 1/2/3/4/5/6 Sharings</p>
            </div>

        </div>
        <div className="explore">
        <button className="btn" onClick={() => navigate("/properties")}>
  Explore Properties
</button>        </div>
        <div className="quote">
            <h2>Feels just like home</h2>
        </div>
        </div>
        </>
    )

}

export default Home;
import HomeHeader from "./homeHeader/homeHeader";
import styles from "./Home.module.css";
import ImageTextCarousel from "../components/imageTextCarousel/imageTextCarousel";
import SubscribeComponent from "../components/subscribeComponent/subscribeComponent";
import AboutUs from "../components/aboutUsComponent/aboutUs";
import MainProducts from "../components/mainProductsComponent/mainProducts";
import Contact from "../components/contactComponent/contact";

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <HomeHeader />
            <ImageTextCarousel />
            <SubscribeComponent />
            <AboutUs />
            <MainProducts />
            <Contact />
          
        </div>
    );
};

export default Home;
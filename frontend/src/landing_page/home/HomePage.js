import React from 'react';
import Hero from './Hero';
import Awards from './Awards';
import Stats from './Stats'
import Education from './Education';
import Pricing from './Pricing';
import Openaccount from '../OpenAccount';
import Navbar from '../Navbar';
import Footer from '../Footer';


function HomePage(){
    return (
        <>
            <Navbar/>
            <Hero/>
            <Awards/>
            <Stats/>
            <Pricing/>
            <Education/>
             <Openaccount/> 
            <Footer/>

        </>
    );
}


export default HomePage;
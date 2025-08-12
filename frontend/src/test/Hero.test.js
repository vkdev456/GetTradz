import React from 'react';

import {render,screen}from '@testing-library/react';
import '@testing-library/jest-dom';


import Hero from "../landing_page/home/Hero";

//Test Suite - Given multiple test cases at a time

describe('Hero Component',()=>{
    test('render hero image',()=>{
          render(<Hero/>);
          const heroimage=screen.getByAltText("Hero Image");
          expect(heroImage).toBeInTheDocument();
          expect(heroImage).toHaveAttribute();
          expect(heroImage).toHaveAttribute('src','media/images/homeHero.png');

    });
});


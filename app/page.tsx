import { Banner } from '@/components/homePage/Banner';
import { TestimonialsAndCTA } from '@/components/homePage/TestimonialsAndCTA';
import { WhyChooseFixMate } from '@/components/homePage/WhyChooseFixMate';
import React from 'react';

const page = () => {
  return (
    <div>
        <Banner/>
        <WhyChooseFixMate/> 
        <TestimonialsAndCTA/>
    </div>
  );
};

export default page;
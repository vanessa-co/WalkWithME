import React from 'react';
import './style.css';

function AboutUs() {
  const imageURL = 'https://www.arlingtonva.us/files/sharedassets/public/walking-to-school-bus-for-walk-friendly-communities-news-release-copy.jpg?w=1080';

  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <div className="about-us-content">
        <div className="about-us-text">
          <p>
            Walk With Me is a community designed for individuals who share a passion for walking, whether it's for charity events, spirited marathons, or tranquil strolls through nature.
             Our mission is to inspire a greater appreciation for the outdoors, nurture a culture of wellness, and foster a commitment to reducing our carbon footprints.
          </p>
          <p>
            As a member of Walk With Me, you'll connect with a diverse group of like-minded individuals, all eager to explore the world on foot and make a positive impact on both their personal well-being, and by helping others.
          </p>
          <p>
            Join Walk With Me today and take the first step towards a lifetime of adventure, camaraderie, and meaningful strides towards a greener world.
          </p>
        </div>
        <div className="about-us-image">
          <img src={imageURL} alt="Walk With Me" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

import React from 'react'
import "../components/Navbar.css";
import Navbar from "../components/Navbar.jsx";

const About = () => {
  return (
    <div>
      <Navbar />
      
      {/* Header Banner */}
      <div className="about-header text-center text-white py-5 mb-4">
        <h1 className="fw-bold display-4">About Sunbeam</h1>
        <p className="lead">Empowering professionals with cutting-edge training and solutions since the late 90's</p>
      </div>

      <div className="container">
        {/* Our Philosophy - Full Width */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header custom-card-header text-white fw-bold">
            💡 Our Philosophy
          </div>
          <div className="card-body text-secondary">
            <p>
              At Sunbeam we believe retaining a competitive edge is imperative for any individual in today's professional world. 
              Companies are restructuring their organizations & reengineering their business processes. Not only have the 
              challenges become more demanding, but also the rewards of staying at the forefront seem to be promising.
            </p>
          </div>
        </div>

        <div className="row">
          {/* Our Expertise */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-white custom-text-cyan fw-bold border-bottom-0">
                ⭐ Our Expertise
              </div>
              <div className="card-body text-secondary">
                <p>
                  In this scenario, technical & personal skills which provide effective solutions & 
                  time critical support are of principal significance for the long term growth of 
                  professionals. Sunbeam's expertise in effectively delivering training, solutions & 
                  services has made it a favored institution to many students & professionals 
                  focused on an aggressive career growth strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Our Success */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-white custom-text-cyan fw-bold border-bottom-0">
                🏆 Our Success
              </div>
              <div className="card-body text-secondary">
                <p>
                  Sunbeam's proven track record in bringing about effective transformations in 
                  individuals is backed by a solid understanding of the rapidly changing needs of 
                  the industry & the global business scenario. Sunbeam's success has been built 
                  on its comprehensively researched, innovative training methodologies, 
                  deployment of technology and an emphasis on transformational & industry-relevant 
                  programs offering value-added services to its clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default About
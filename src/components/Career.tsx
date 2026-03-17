import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>PG-DAC</h4>
                <h5>C-DAC</h5>
              </div>
              <h3>Current</h3>
            </div>
            <p>
              Completing Post Graduate Diploma in Advanced Computing (PG-DAC) to
              strengthen expertise in advanced software development and architecture.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Business Development Executive</h4>
                <h5>DEVTOWN PVT LTD</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Worked as a Business Development Executive for 8 months, gaining
              experience in client relations and strategic growth.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>BE in Information Technology</h4>
                <h5>Anantrao Pawar College of Engineering &amp; Research (APCOER)</h5>
              </div>
              <h3>2020 - 2024</h3>
            </div>
            <p>
              Graduated with 79% in Information Technology, focusing on core
              engineering principles and software systems.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>HSC (Science)</h4>
                <h5>Shri Tripura Junior Science College Latur</h5>
              </div>
              <h3>2018 - 2020</h3>
            </div>
            <p>
              Completed HSC in Science under the Reliance Latur Pattern, building a
              strong foundation in scientific disciplines.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SSC</h4>
                <h5>Shri Keshavraj Madhyamik Vidyalaya</h5>
              </div>
              <h3>2018</h3>
            </div>
            <p>
              Passed out with an excellent score of 85%, demonstrating consistent
              academic dedication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

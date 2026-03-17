import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:jaykaradkhele@gmail.com" data-cursor="disable">
                jaykaradkhele@gmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>BE IT (APCOER) · PG-DAC (C-DAC)</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Jayesh-karadkhele"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
              rel="noreferrer"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/jayesh-karadkhele-b04b50252"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
              rel="noreferrer"
            >
              Linkedin <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Jayesh Karadkhele</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

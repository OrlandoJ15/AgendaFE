import React from "react";
import '../Styles/home.css';
import Box from '@mui/material/Box';
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import img1 from '../assets/agenda.jpg'; // Asegúrate de usar las rutas correctas
import img2 from '../assets/babilonia.jpg';
//import imagen3 from '../assets/imagen3.jpg';
// ... importa más imágenes según sea necesario

const data = [
  { name: "First Company", image: img1 },
  { name: "Second Company", image: img2 },
  // Agrega más objetos de empresa con imágenes
];

const dataPerPage = 6;

const durationEnter = 1500;
const durationExit = 500;

class Slider extends React.Component {
  constructor() {
    super();

    this.state = {
      currentSlide: 0,
      currentPage: 1,
      totalPages: Math.ceil(data.length / dataPerPage),
      cycles: 0,
      timerId: null
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCarouselTurn = this.handleCarouselTurn.bind(this);
    this.getChangeOfPage = this.getChangeOfPage.bind(this);
    this.getPointIndexes = this.getPointIndexes.bind(this);
  }

  componentDidMount() {
    const timerId = setInterval(() => this.handleCarouselTurn(timerId), 5000);
    this.setState({ timerId });
  }

  componentWillUnmount() {
    const { timerId } = this.state;
    clearInterval(timerId);
  }

  handleCarouselTurn(timerId) {
    const newState = { ...this.state };

    if (newState.cycles === 10) {
      clearInterval(timerId);
      return;
    }

    if (newState.currentSlide + 1 >= data.length) {
      newState.cycles += 1;
      newState.currentSlide = 0;
    } else {
      newState.currentSlide += 1;
    }

    newState.currentPage = this.getChangeOfPage(
      newState.currentSlide,
      newState.currentPage
    );

    this.setState({ ...newState });
  }

  handleClick(to) {
    this.setState((prevState) => ({
      currentSlide: to,
      currentPage: this.getChangeOfPage(to, prevState.currentPage)
    }));
  }

  getChangeOfPage(currentSlide, currentPage) {
    const { totalPages } = this.state;
    if (currentSlide === 0) return 1;

    if (currentSlide === (dataPerPage - 1) * currentPage) {
      return currentPage === totalPages ? 1 : currentPage + 1;
    }

    if (
      currentSlide === (dataPerPage - 1) * (currentPage - 1) &&
      currentSlide !== 0
    ) return currentPage - 1;

    return currentPage;
  }

  getPointIndexes() {
    const { currentPage } = this.state;

    return [...Array(dataPerPage).keys()].map(
      (x) => x + (dataPerPage - 1) * (currentPage - 1)
    );
  }

  render() {
    const { currentSlide, currentPage, totalPages } = this.state;

    const indexArray = this.getPointIndexes();

    return (
      <div className="Slider">
        <Box className="principal">
          <Box className="carousel">
            {data.map((d, index) => (
              <Fade
                key={`${d.name}${index}`}
                className="content"
                in={index === currentSlide}
                timeout={{ enter: durationEnter, exit: durationExit }}
              >
                <Box>
                  <img src={d.image} alt={d.name} style={{ width: '100%', height: 'auto' }} />
                  <h3>{d.name}</h3>
                </Box>
              </Fade>
            ))}
          </Box>

          <Box className="dot">
            {indexArray.map((index) => {
              if (currentPage > totalPages || index >= data.length) {
                return null;
              }
              return (
                <span
                  key={`dot-${index}`}
                  onClick={() => this.handleClick(index)}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    fontSize:
                      (index === (dataPerPage - 1) * currentPage &&
                        currentPage < totalPages) ||
                      (index === (dataPerPage - 1) * (currentPage - 1) && index !== 0)
                        ? "15px"
                        : "20px",
                    color: currentSlide === index ? "salmon" : "pink",
                    textShadow: "0 3px 3px mistyrose"
                  }}
                >
                  &#9679;
                </span>
              );
            })}
          </Box>
        </Box>
      </div>
    );
  }
}

export default Slider;

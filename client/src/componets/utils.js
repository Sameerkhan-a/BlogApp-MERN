import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  font: {
    fontFamily: "Roboto, Arial, sans-serif !important",
  },
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
});
